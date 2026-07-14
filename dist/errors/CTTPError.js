"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CTTPError = void 0;
class CTTPError extends Error {
    constructor(status, message, code, details) {
        super(message);
        this.name = "CTTPError";
        this.status = status;
        this.code = code || "UNKNOWN_ERROR";
        this.details = details || null;
        Object.setPrototypeOf(this, CTTPError.prototype);
    }
    getStatus() {
        return this.status;
    }
    getCode() {
        return this.code;
    }
    getDetails() {
        return this.details;
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            status: this.status,
            code: this.code,
            details: this.details
        };
    }
}
exports.CTTPError = CTTPError;
//# sourceMappingURL=CTTPError.js.map