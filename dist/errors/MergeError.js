"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeError = void 0;
const CTTPError_1 = require("./CTTPError");
class MergeError extends CTTPError_1.CTTPError {
    constructor(message, details) {
        super(400, message, "MERGE_ERROR", details);
        this.name = "MergeError";
        Object.setPrototypeOf(this, MergeError.prototype);
    }
}
exports.MergeError = MergeError;
//# sourceMappingURL=MergeError.js.map