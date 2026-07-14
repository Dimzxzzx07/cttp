"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditError = void 0;
const CTTPError_1 = require("./CTTPError");
class AuditError extends CTTPError_1.CTTPError {
    constructor(message, details) {
        super(400, message, "AUDIT_ERROR", details);
        this.name = "AuditError";
        Object.setPrototypeOf(this, AuditError.prototype);
    }
}
exports.AuditError = AuditError;
//# sourceMappingURL=AuditError.js.map