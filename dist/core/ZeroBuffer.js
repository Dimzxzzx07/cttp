"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeroBuffer = void 0;
const Constants_1 = require("./Constants");
class ZeroBuffer {
    constructor(config) {
        this.config = config;
        this.constants = new Constants_1.Constants();
        this.zeroedBuffers = new Set();
    }
    zero(buffer) {
        if (this.config.enableZeroing !== false) {
            for (let i = 0; i < buffer.length; i++) {
                buffer[i] = 0;
            }
            this.zeroedBuffers.add(buffer);
        }
        return buffer;
    }
    zeroString(str) {
        if (this.config.enableZeroing !== false) {
            const buffer = Buffer.from(str);
            this.zero(buffer);
            return buffer.toString();
        }
        return str;
    }
    zeroObject(obj) {
        if (this.config.enableZeroing !== false) {
            if (typeof obj === "string") {
                return this.zeroString(obj);
            }
            if (Buffer.isBuffer(obj)) {
                return this.zero(obj);
            }
            if (typeof obj === "object" && obj !== null) {
                for (const key of Object.keys(obj)) {
                    if (typeof obj[key] === "string") {
                        obj[key] = this.zeroString(obj[key]);
                    }
                    else if (Buffer.isBuffer(obj[key])) {
                        obj[key] = this.zero(obj[key]);
                    }
                    else if (typeof obj[key] === "object") {
                        this.zeroObject(obj[key]);
                    }
                }
            }
        }
        return obj;
    }
    isZeroed(buffer) {
        for (let i = 0; i < buffer.length; i++) {
            if (buffer[i] !== 0) {
                return false;
            }
        }
        return true;
    }
    getZeroedCount() {
        return this.zeroedBuffers.size;
    }
    clear() {
        this.zeroedBuffers.clear();
    }
}
exports.ZeroBuffer = ZeroBuffer;
//# sourceMappingURL=ZeroBuffer.js.map