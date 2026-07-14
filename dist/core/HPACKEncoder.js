"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HPACKEncoder = void 0;
class HPACKEncoder {
    constructor() {
        this.staticTable = new Map([
            [":authority", 1],
            [":method", 2],
            [":method-GET", 3],
            [":method-POST", 4],
            [":path", 5],
            [":path-/", 6],
            [":path-/index.html", 7],
            [":scheme", 8],
            [":scheme-http", 9],
            [":scheme-https", 10],
            [":status", 11],
            [":status-200", 12],
            [":status-204", 13],
            [":status-206", 14],
            [":status-304", 15],
            [":status-400", 16],
            [":status-404", 17],
            [":status-500", 18],
            ["accept-charset", 19],
            ["accept-encoding", 20],
            ["accept-language", 21],
            ["accept-ranges", 22],
            ["accept", 23],
            ["access-control-allow-origin", 24],
            ["age", 25],
            ["allow", 26],
            ["authorization", 27],
            ["cache-control", 28],
            ["content-disposition", 29],
            ["content-encoding", 30],
            ["content-language", 31],
            ["content-length", 32],
            ["content-location", 33],
            ["content-range", 34],
            ["content-type", 35],
            ["cookie", 36],
            ["date", 37],
            ["etag", 38],
            ["expect", 39],
            ["expires", 40],
            ["from", 41],
            ["host", 42],
            ["if-match", 43],
            ["if-modified-since", 44],
            ["if-none-match", 45],
            ["if-range", 46],
            ["if-unmodified-since", 47],
            ["last-modified", 48],
            ["link", 49],
            ["location", 50],
            ["max-forwards", 51],
            ["proxy-authenticate", 52],
            ["proxy-authorization", 53],
            ["range", 54],
            ["referer", 55],
            ["refresh", 56],
            ["retry-after", 57],
            ["server", 58],
            ["set-cookie", 59],
            ["strict-transport-security", 60],
            ["transfer-encoding", 61],
            ["user-agent", 62],
            ["vary", 63],
            ["via", 64],
            ["www-authenticate", 65]
        ]);
        this.dynamicTable = new Map();
        this.maxTableSize = 4096;
    }
    encode(headers) {
        const result = [];
        for (const [key, value] of headers) {
            const staticIndex = this.getStaticIndex(key, value);
            if (staticIndex !== -1) {
                const indexBuffer = Buffer.alloc(2);
                indexBuffer.writeUInt16BE(staticIndex, 0);
                result.push(indexBuffer);
                continue;
            }
            const dynamicIndex = this.getDynamicIndex(key, value);
            if (dynamicIndex !== -1) {
                const indexBuffer = Buffer.alloc(2);
                indexBuffer.writeUInt16BE(this.staticTable.size + dynamicIndex, 0);
                result.push(indexBuffer);
                continue;
            }
            const keyBuffer = Buffer.from(key, "utf8");
            const valueBuffer = Buffer.from(value, "utf8");
            const length = keyBuffer.length + valueBuffer.length + 2;
            const buffer = Buffer.alloc(length);
            buffer[0] = 0x40;
            buffer[1] = keyBuffer.length;
            keyBuffer.copy(buffer, 2);
            buffer[2 + keyBuffer.length] = valueBuffer.length;
            valueBuffer.copy(buffer, 3 + keyBuffer.length);
            result.push(buffer);
            this.addToDynamicTable(key, value);
        }
        return Buffer.concat(result);
    }
    decode(data) {
        const headers = new Map();
        let offset = 0;
        while (offset < data.length) {
            const firstByte = data[offset];
            if ((firstByte & 0x80) === 0x80) {
                const index = (firstByte & 0x7f) << 8 | data[offset + 1];
                const [key, value] = this.getHeader(index);
                if (key) {
                    headers.set(key, value || "");
                }
                offset += 2;
            }
            else if ((firstByte & 0x40) === 0x40) {
                const keyLength = data[offset + 1];
                const key = data.subarray(offset + 2, offset + 2 + keyLength).toString("utf8");
                const valueLength = data[offset + 2 + keyLength];
                const value = data.subarray(offset + 3 + keyLength, offset + 3 + keyLength + valueLength).toString("utf8");
                headers.set(key, value);
                this.addToDynamicTable(key, value);
                offset += 3 + keyLength + valueLength;
            }
            else {
                const index = firstByte & 0x7f;
                const [key, value] = this.getHeader(index);
                if (key) {
                    headers.set(key, value || "");
                }
                offset += 1;
            }
        }
        return headers;
    }
    getStaticIndex(key, value) {
        const fullKey = `${key}-${value}`;
        if (this.staticTable.has(fullKey)) {
            return this.staticTable.get(fullKey);
        }
        if (this.staticTable.has(key)) {
            return this.staticTable.get(key);
        }
        return -1;
    }
    getDynamicIndex(key, value) {
        let index = 1;
        for (const [k, v] of this.dynamicTable) {
            if (k === key && v === value) {
                return index;
            }
            index++;
        }
        return -1;
    }
    getHeader(index) {
        for (const [key, value] of this.staticTable) {
            if (value === index) {
                const parts = key.split("-");
                if (parts.length === 2) {
                    return [parts[0], parts[1]];
                }
                return [key, ""];
            }
        }
        let dynamicIndex = index - this.staticTable.size;
        let count = 1;
        for (const [key, value] of this.dynamicTable) {
            if (count === dynamicIndex) {
                return [key, value];
            }
            count++;
        }
        return ["", ""];
    }
    addToDynamicTable(key, value) {
        const size = key.length + value.length + 32;
        while (this.dynamicTable.size * 32 + this.getDynamicSize() + size > this.maxTableSize) {
            const firstKey = this.dynamicTable.keys().next().value;
            if (firstKey) {
                this.dynamicTable.delete(firstKey);
            }
        }
        this.dynamicTable.set(key, value);
    }
    getDynamicSize() {
        let size = 0;
        for (const [key, value] of this.dynamicTable) {
            size += key.length + value.length + 32;
        }
        return size;
    }
    setMaxTableSize(size) {
        this.maxTableSize = size;
    }
    getMaxTableSize() {
        return this.maxTableSize;
    }
    clearDynamicTable() {
        this.dynamicTable.clear();
    }
}
exports.HPACKEncoder = HPACKEncoder;
//# sourceMappingURL=HPACKEncoder.js.map