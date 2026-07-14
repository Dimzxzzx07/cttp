"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferUtils = void 0;
class BufferUtils {
    concat(buffers) {
        return Buffer.concat(buffers);
    }
    slice(buffer, start, end) {
        return buffer.subarray(start, end);
    }
    copy(source, target, targetStart, sourceStart, sourceEnd) {
        return source.copy(target, targetStart, sourceStart, sourceEnd);
    }
    equals(a, b) {
        return a.equals(b);
    }
    compare(a, b) {
        return a.compare(b);
    }
    swap16(buffer) {
        const result = Buffer.allocUnsafe(buffer.length);
        for (let i = 0; i < buffer.length; i += 2) {
            if (i + 1 < buffer.length) {
                result[i] = buffer[i + 1];
                result[i + 1] = buffer[i];
            }
        }
        return result;
    }
    swap32(buffer) {
        const result = Buffer.allocUnsafe(buffer.length);
        for (let i = 0; i < buffer.length; i += 4) {
            if (i + 3 < buffer.length) {
                result[i] = buffer[i + 3];
                result[i + 1] = buffer[i + 2];
                result[i + 2] = buffer[i + 1];
                result[i + 3] = buffer[i];
            }
        }
        return result;
    }
    zero(buffer) {
        buffer.fill(0);
    }
    isZero(buffer) {
        for (let i = 0; i < buffer.length; i++) {
            if (buffer[i] !== 0) {
                return false;
            }
        }
        return true;
    }
    toHex(buffer) {
        return buffer.toString("hex");
    }
    fromHex(hex) {
        return Buffer.from(hex, "hex");
    }
    toBase64(buffer) {
        return buffer.toString("base64");
    }
    fromBase64(base64) {
        return Buffer.from(base64, "base64");
    }
    toUTF8(buffer) {
        return buffer.toString("utf8");
    }
    fromUTF8(utf8) {
        return Buffer.from(utf8, "utf8");
    }
    pad(buffer, length, value = 0) {
        const result = Buffer.allocUnsafe(Math.max(buffer.length, length));
        result.fill(value);
        buffer.copy(result);
        return result;
    }
    truncate(buffer, length) {
        return buffer.subarray(0, Math.min(buffer.length, length));
    }
    split(buffer, delimiter) {
        const result = [];
        let start = 0;
        for (let i = 0; i < buffer.length; i++) {
            if (buffer[i] === delimiter) {
                result.push(buffer.subarray(start, i));
                start = i + 1;
            }
        }
        if (start < buffer.length) {
            result.push(buffer.subarray(start));
        }
        return result;
    }
    join(buffers, delimiter) {
        if (buffers.length === 0) {
            return Buffer.alloc(0);
        }
        const totalLength = buffers.reduce((sum, b) => sum + b.length, 0) + (buffers.length - 1);
        const result = Buffer.allocUnsafe(totalLength);
        let offset = 0;
        for (let i = 0; i < buffers.length; i++) {
            buffers[i].copy(result, offset);
            offset += buffers[i].length;
            if (i < buffers.length - 1) {
                result[offset++] = delimiter;
            }
        }
        return result;
    }
}
exports.BufferUtils = BufferUtils;
//# sourceMappingURL=BufferUtils.js.map