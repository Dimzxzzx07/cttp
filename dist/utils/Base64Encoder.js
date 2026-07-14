"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base64Encoder = void 0;
class Base64Encoder {
    encode(data) {
        return data.toString("base64");
    }
    decode(data) {
        return Buffer.from(data, "base64");
    }
    encodeURLSafe(data) {
        return data.toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    }
    decodeURLSafe(data) {
        let base64 = data.replace(/-/g, "+").replace(/_/g, "/");
        while (base64.length % 4) {
            base64 += "=";
        }
        return Buffer.from(base64, "base64");
    }
    encodeUtf8(text) {
        return this.encode(Buffer.from(text, "utf8"));
    }
    decodeUtf8(data) {
        return this.decode(data).toString("utf8");
    }
    isBase64(str) {
        try {
            return Buffer.from(str, "base64").toString("base64") === str;
        }
        catch {
            return false;
        }
    }
}
exports.Base64Encoder = Base64Encoder;
//# sourceMappingURL=Base64Encoder.js.map