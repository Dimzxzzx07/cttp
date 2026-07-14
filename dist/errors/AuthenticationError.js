"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationError = void 0;
const CTTPError_1 = require("./CTTPError");
class AuthenticationError extends CTTPError_1.CTTPError {
    constructor(message, details) {
        super(401, message, "AUTHENTICATION_ERROR", details);
        this.name = "AuthenticationError";
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}
exports.AuthenticationError = AuthenticationError;
//# sourceMappingURL=AuthenticationError.js.map