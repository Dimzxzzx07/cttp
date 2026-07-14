"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyHandler = void 0;
const CTTPResponse_1 = require("../core/CTTPResponse");
const HTTPVersion_1 = require("../core/HTTPVersion");
class VerifyHandler {
    async handle(request) {
        const body = request.getBody();
        const type = body?.type;
        const value = body?.value;
        const options = body?.options || {};
        if (!type || value === undefined) {
            return new CTTPResponse_1.CTTPResponse(400, "Bad Request", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), { error: "Missing type or value" });
        }
        const valid = this.verifyValue(type, value, options);
        return new CTTPResponse_1.CTTPResponse(200, "OK", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), {
            valid,
            message: valid ? "Verification successful" : "Verification failed",
            timestamp: Date.now(),
            details: this.getDetails(type, value)
        });
    }
    verifyValue(type, value, options) {
        switch (type) {
            case "otp":
                return this.verifyOTP(value, options);
            case "email":
                return this.verifyEmail(value);
            case "phone":
                return this.verifyPhone(value);
            case "json":
                return this.verifyJSON(value, options.schema);
            case "jwt":
                return this.verifyJWT(value);
            case "signature":
                return this.verifySignature(value.data, value.signature);
            case "checksum":
                return this.verifyChecksum(value.data, value.checksum);
            default:
                return false;
        }
    }
    verifyOTP(otp, options) {
        const expected = options?.expected || "123456";
        return otp === expected;
    }
    verifyEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    verifyPhone(phone) {
        const regex = /^\+?[1-9]\d{1,14}$/;
        return regex.test(phone);
    }
    verifyJSON(json, schema) {
        if (!schema) {
            return typeof json === "object" && json !== null;
        }
        try {
            return this.validateJSONSchema(json, schema);
        }
        catch {
            return false;
        }
    }
    verifyJWT(token) {
        try {
            const parts = token.split(".");
            if (parts.length !== 3)
                return false;
            const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
            const exp = payload.exp || 0;
            return exp > Math.floor(Date.now() / 1000);
        }
        catch {
            return false;
        }
    }
    verifySignature(data, signature) {
        const crypto = require("crypto");
        const calculated = crypto
            .createHash("sha256")
            .update(JSON.stringify(data))
            .digest("hex");
        return calculated === signature;
    }
    verifyChecksum(data, checksum) {
        const crypto = require("crypto");
        const calculated = crypto
            .createHash("md5")
            .update(JSON.stringify(data))
            .digest("hex");
        return calculated === checksum;
    }
    validateJSONSchema(json, schema) {
        const keys = Object.keys(schema);
        for (const key of keys) {
            if (!json.hasOwnProperty(key)) {
                return false;
            }
            if (schema[key] === "string" && typeof json[key] !== "string") {
                return false;
            }
            if (schema[key] === "number" && typeof json[key] !== "number") {
                return false;
            }
            if (schema[key] === "boolean" && typeof json[key] !== "boolean") {
                return false;
            }
            if (schema[key] === "object" && typeof json[key] !== "object") {
                return false;
            }
            if (schema[key] === "array" && !Array.isArray(json[key])) {
                return false;
            }
        }
        return true;
    }
    getDetails(type, value) {
        return {
            type,
            value: typeof value === "string" ? value.substring(0, 20) : value,
            timestamp: Date.now()
        };
    }
}
exports.VerifyHandler = VerifyHandler;
//# sourceMappingURL=VerifyHandler.js.map