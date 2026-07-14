"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginHandler = void 0;
const CTTPResponse_1 = require("../core/CTTPResponse");
const HTTPVersion_1 = require("../core/HTTPVersion");
class LoginHandler {
    async handle(request) {
        const body = request.getBody();
        const credentials = body || {};
        const username = credentials.username || credentials.email;
        const password = credentials.password;
        if (!username || !password) {
            return new CTTPResponse_1.CTTPResponse(400, "Bad Request", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), { error: "Missing credentials" });
        }
        const token = this.generateToken(username);
        const refreshToken = this.generateRefreshToken(username);
        const expiresIn = 3600;
        return new CTTPResponse_1.CTTPResponse(200, "OK", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), {
            accessToken: token,
            refreshToken: refreshToken,
            expiresIn: expiresIn,
            tokenType: "Bearer"
        });
    }
    generateToken(username) {
        const crypto = require("crypto");
        const payload = {
            username,
            exp: Math.floor(Date.now() / 1000) + 3600
        };
        const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
        const signature = crypto
            .createHmac("sha256", "secret")
            .update(base64Payload)
            .digest("base64");
        return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${base64Payload}.${signature}`;
    }
    generateRefreshToken(username) {
        const crypto = require("crypto");
        return crypto.randomBytes(32).toString("hex");
    }
}
exports.LoginHandler = LoginHandler;
//# sourceMappingURL=LoginHandler.js.map