"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolError = void 0;
const CTTPError_1 = require("./CTTPError");
class ProtocolError extends CTTPError_1.CTTPError {
    constructor(message, code, details) {
        super(400, message, code || "PROTOCOL_ERROR", details);
        this.name = "ProtocolError";
        Object.setPrototypeOf(this, ProtocolError.prototype);
    }
}
exports.ProtocolError = ProtocolError;
//# sourceMappingURL=ProtocolError.js.map