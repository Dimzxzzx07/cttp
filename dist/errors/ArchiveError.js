"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchiveError = void 0;
const CTTPError_1 = require("./CTTPError");
class ArchiveError extends CTTPError_1.CTTPError {
    constructor(message, details) {
        super(400, message, "ARCHIVE_ERROR", details);
        this.name = "ArchiveError";
        Object.setPrototypeOf(this, ArchiveError.prototype);
    }
}
exports.ArchiveError = ArchiveError;
//# sourceMappingURL=ArchiveError.js.map