"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutHandler = void 0;
const CTTPResponse_1 = require("../core/CTTPResponse");
const HTTPVersion_1 = require("../core/HTTPVersion");
class LogoutHandler {
    async handle(request) {
        const body = request.getBody();
        const token = body?.token || request.getAuthorization();
        if (!token) {
            return new CTTPResponse_1.CTTPResponse(400, "Bad Request", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), { error: "Missing token" });
        }
        const isValid = this.validateToken(token);
        if (!isValid) {
            return new CTTPResponse_1.CTTPResponse(401, "Unauthorized", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), { error: "Invalid token" });
        }
        this.invalidateToken(token);
        return new CTTPResponse_1.CTTPResponse(200, "OK", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), { success: true, message: "Logout successful" });
    }
    validateToken(token) {
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
    invalidateToken(token) {
        const invalidated = new Set();
        invalidated.add(token);
    }
}
exports.LogoutHandler = LogoutHandler;
//# sourceMappingURL=LogoutHandler.js.map