"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HexEncoder = void 0;
class HexEncoder {
    encode(data) {
        return data.toString("hex");
    }
    decode(data) {
        return Buffer.from(data, "hex");
    }
    encodeUtf8(text) {
        return this.encode(Buffer.from(text, "utf8"));
    }
    decodeUtf8(data) {
        return this.decode(data).toString("utf8");
    }
    isHex(str) {
        return /^[0-9a-fA-F]+$/.test(str) && str.length % 2 === 0;
    }
    toByteArray(str) {
        const bytes = [];
        for (let i = 0; i < str.length; i += 2) {
            bytes.push(parseInt(str.substr(i, 2), 16));
        }
        return bytes;
    }
    fromByteArray(bytes) {
        return bytes.map(b => b.toString(16).padStart(2, "0")).join("");
    }
}
exports.HexEncoder = HexEncoder;
//# sourceMappingURL=HexEncoder.js.map