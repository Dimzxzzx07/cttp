"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadError = void 0;
const CTTPError_1 = require("./CTTPError");
class UploadError extends CTTPError_1.CTTPError {
    constructor(message, details) {
        super(400, message, "UPLOAD_ERROR", details);
        this.name = "UploadError";
        Object.setPrototypeOf(this, UploadError.prototype);
    }
}
exports.UploadError = UploadError;
//# sourceMappingURL=UploadError.js.map