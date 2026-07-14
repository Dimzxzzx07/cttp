"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamError = void 0;
const CTTPError_1 = require("./CTTPError");
class StreamError extends CTTPError_1.CTTPError {
    constructor(message, details) {
        super(400, message, "STREAM_ERROR", details);
        this.name = "StreamError";
        Object.setPrototypeOf(this, StreamError.prototype);
    }
}
exports.StreamError = StreamError;
//# sourceMappingURL=StreamError.js.map