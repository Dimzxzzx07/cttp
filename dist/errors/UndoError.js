"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UndoError = void 0;
const CTTPError_1 = require("./CTTPError");
class UndoError extends CTTPError_1.CTTPError {
    constructor(message, details) {
        super(400, message, "UNDO_ERROR", details);
        this.name = "UndoError";
        Object.setPrototypeOf(this, UndoError.prototype);
    }
}
exports.UndoError = UndoError;
//# sourceMappingURL=UndoError.js.map