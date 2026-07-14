"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderBuilder = void 0;
class HeaderBuilder {
    constructor() {
        this.headers = new Map();
    }
    add(key, value) {
        this.headers.set(key, value);
    }
    set(key, value) {
        this.headers.set(key, value);
    }
    get(key) {
        return this.headers.get(key);
    }
    remove(key) {
        this.headers.delete(key);
    }
    has(key) {
        return this.headers.has(key);
    }
    clear() {
        this.headers.clear();
    }
    build() {
        return new Map(this.headers);
    }
    toObject() {
        const obj = {};
        for (const [key, value] of this.headers) {
            obj[key] = value;
        }
        return obj;
    }
    fromObject(obj) {
        for (const [key, value] of Object.entries(obj)) {
            this.headers.set(key, value);
        }
    }
    toBuffer() {
        let result = "";
        for (const [key, value] of this.headers) {
            result += `${key}: ${value}\r\n`;
        }
        return Buffer.from(result);
    }
    fromBuffer(buffer) {
        const lines = buffer.toString().split("\r\n");
        for (const line of lines) {
            if (!line.trim())
                continue;
            const [key, ...valueParts] = line.split(":");
            if (key && valueParts.length > 0) {
                this.headers.set(key.trim(), valueParts.join(":").trim());
            }
        }
    }
    clone() {
        const builder = new HeaderBuilder();
        for (const [key, value] of this.headers) {
            builder.add(key, value);
        }
        return builder;
    }
}
exports.HeaderBuilder = HeaderBuilder;
//# sourceMappingURL=HeaderBuilder.js.map