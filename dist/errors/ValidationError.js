"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
const CTTPError_1 = require("./CTTPError");
class ValidationError extends CTTPError_1.CTTPError {
    constructor(message, details) {
        super(400, message, "VALIDATION_ERROR", details);
        this.name = "ValidationError";
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=ValidationError.js.map