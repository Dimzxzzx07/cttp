"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshHandler = void 0;
const CTTPResponse_1 = require("../core/CTTPResponse");
const HTTPVersion_1 = require("../core/HTTPVersion");
class RefreshHandler {
    constructor() {
        this.refreshTokens = new Map();
    }
    async handle(request) {
        const body = request.getBody();
        const refreshToken = body?.refreshToken;
        if (!refreshToken) {
            return new CTTPResponse_1.CTTPResponse(400, "Bad Request", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), { error: "Missing refresh token" });
        }
        const isValid = this.validateRefreshToken(refreshToken);
        if (!isValid) {
            return new CTTPResponse_1.CTTPResponse(401, "Unauthorized", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), { error: "Invalid refresh token" });
        }
        const userData = this.getUserData(refreshToken);
        const newAccessToken = this.generateAccessToken(userData);
        const newRefreshToken = this.generateRefreshToken();
        this.refreshTokens.set(newRefreshToken, userData);
        this.refreshTokens.delete(refreshToken);
        return new CTTPResponse_1.CTTPResponse(200, "OK", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            expiresIn: 3600,
            tokenType: "Bearer"
        });
    }
    validateRefreshToken(token) {
        return this.refreshTokens.has(token);
    }
    getUserData(token) {
        return this.refreshTokens.get(token);
    }
    generateAccessToken(userData) {
        const crypto = require("crypto");
        const payload = {
            ...userData,
            exp: Math.floor(Date.now() / 1000) + 3600
        };
        const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
        const signature = crypto
            .createHmac("sha256", "secret")
            .update(base64Payload)
            .digest("base64");
        return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${base64Payload}.${signature}`;
    }
    generateRefreshToken() {
        const crypto = require("crypto");
        return crypto.randomBytes(32).toString("hex");
    }
}
exports.RefreshHandler = RefreshHandler;
//# sourceMappingURL=RefreshHandler.js.map