"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotifyError = void 0;
const CTTPError_1 = require("./CTTPError");
class NotifyError extends CTTPError_1.CTTPError {
    constructor(message, details) {
        super(400, message, "NOTIFY_ERROR", details);
        this.name = "NotifyError";
        Object.setPrototypeOf(this, NotifyError.prototype);
    }
}
exports.NotifyError = NotifyError;
//# sourceMappingURL=NotifyError.js.map