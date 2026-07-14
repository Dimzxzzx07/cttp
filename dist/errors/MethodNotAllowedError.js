"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodNotAllowedError = void 0;
const CTTPError_1 = require("./CTTPError");
class MethodNotAllowedError extends CTTPError_1.CTTPError {
    constructor(method) {
        super(405, `Method ${method} not allowed`, "METHOD_NOT_ALLOWED", { method });
        this.name = "MethodNotAllowedError";
        Object.setPrototypeOf(this, MethodNotAllowedError.prototype);
    }
}
exports.MethodNotAllowedError = MethodNotAllowedError;
//# sourceMappingURL=MethodNotAllowedError.js.map