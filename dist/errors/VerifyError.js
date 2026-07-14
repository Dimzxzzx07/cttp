"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyError = void 0;
const CTTPError_1 = require("./CTTPError");
class VerifyError extends CTTPError_1.CTTPError {
    constructor(message, details) {
        super(400, message, "VERIFY_ERROR", details);
        this.name = "VerifyError";
        Object.setPrototypeOf(this, VerifyError.prototype);
    }
}
exports.VerifyError = VerifyError;
//# sourceMappingURL=VerifyError.js.map