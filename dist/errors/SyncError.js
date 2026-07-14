"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncError = void 0;
const CTTPError_1 = require("./CTTPError");
class SyncError extends CTTPError_1.CTTPError {
    constructor(message, details) {
        super(400, message, "SYNC_ERROR", details);
        this.name = "SyncError";
        Object.setPrototypeOf(this, SyncError.prototype);
    }
}
exports.SyncError = SyncError;
//# sourceMappingURL=SyncError.js.map