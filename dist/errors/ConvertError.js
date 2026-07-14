"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertError = void 0;
const CTTPError_1 = require("./CTTPError");
class ConvertError extends CTTPError_1.CTTPError {
    constructor(message, details) {
        super(400, message, "CONVERT_ERROR", details);
        this.name = "ConvertError";
        Object.setPrototypeOf(this, ConvertError.prototype);
    }
}
exports.ConvertError = ConvertError;
//# sourceMappingURL=ConvertError.js.map