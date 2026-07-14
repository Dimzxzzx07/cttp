"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationEngine = void 0;
const CTTPClient_1 = require("./CTTPClient");
const CTTPRequest_1 = require("./CTTPRequest");
const HTTPMethod_1 = require("./HTTPMethod");
const BufferUtils_1 = require("../utils/BufferUtils");
const CryptoUtils_1 = require("../utils/CryptoUtils");
const Constants_1 = require("./Constants");
class VerificationEngine {
    constructor(config) {
        this.config = config;
        this.constants = new Constants_1.Constants();
        this.bufferUtils = new BufferUtils_1.BufferUtils();
        this.cryptoUtils = new CryptoUtils_1.CryptoUtils();
        this.client = new CTTPClient_1.CTTPClient();
        this.verificationCache = new Map();
    }
    async verify(url, options) {
        const verifyId = this.generateVerifyId();
        const type = options.type;
        const value = options.value;
        const request = new CTTPRequest_1.CTTPRequest(HTTPMethod_1.HTTPMethod.VERIFY, url, {
            body: {
                verifyId,
                type,
                value,
                options: options.options || {}
            }
        });
        const response = await this.client.request(request);
        const data = response.getBody();
        const result = {
            valid: data.valid || false,
            message: data.message || "",
            timestamp: data.timestamp || Date.now(),
            details: data.details || null
        };
        this.verificationCache.set(verifyId, result);
        return result;
    }
    generateVerifyId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
    async verifyOTP(otp, url) {
        const endpoint = url || "/verify/otp";
        const result = await this.verify(endpoint, { type: "otp", value: otp });
        return result.valid;
    }
    async verifyEmail(email, url) {
        const endpoint = url || "/verify/email";
        const result = await this.verify(endpoint, { type: "email", value: email });
        return result.valid;
    }
    async verifyPhone(phone, url) {
        const endpoint = url || "/verify/phone";
        const result = await this.verify(endpoint, { type: "phone", value: phone });
        return result.valid;
    }
    async verifyJSON(json, schema, url) {
        const endpoint = url || "/verify/json";
        const result = await this.verify(endpoint, {
            type: "json",
            value: json,
            options: { schema }
        });
        return result.valid;
    }
    async verifyJWT(token, url) {
        const endpoint = url || "/verify/jwt";
        const result = await this.verify(endpoint, { type: "jwt", value: token });
        return result.valid;
    }
    async verifySignature(data, signature, url) {
        const endpoint = url || "/verify/signature";
        const result = await this.verify(endpoint, {
            type: "signature",
            value: { data, signature }
        });
        return result.valid;
    }
    async verifyChecksum(data, checksum, url) {
        const endpoint = url || "/verify/checksum";
        const result = await this.verify(endpoint, {
            type: "checksum",
            value: { data, checksum }
        });
        return result.valid;
    }
    getVerificationResult(verifyId) {
        return this.verificationCache.get(verifyId);
    }
    clearCache(verifyId) {
        if (verifyId) {
            this.verificationCache.delete(verifyId);
        }
        else {
            this.verificationCache.clear();
        }
    }
    async close() {
        await this.client.close();
        this.verificationCache.clear();
    }
}
exports.VerificationEngine = VerificationEngine;
//# sourceMappingURL=VerificationEngine.js.map