"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeoutError = void 0;
const CTTPError_1 = require("./CTTPError");
class TimeoutError extends CTTPError_1.CTTPError {
    constructor(message, code, details) {
        super(408, message, code || "TIMEOUT_ERROR", details);
        this.name = "TimeoutError";
        Object.setPrototypeOf(this, TimeoutError.prototype);
    }
}
exports.TimeoutError = TimeoutError;
//# sourceMappingURL=TimeoutError.js.map