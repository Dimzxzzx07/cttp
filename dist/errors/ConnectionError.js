"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionError = void 0;
const CTTPError_1 = require("./CTTPError");
class ConnectionError extends CTTPError_1.CTTPError {
    constructor(message, code, details) {
        super(500, message, code || "CONNECTION_ERROR", details);
        this.name = "ConnectionError";
        Object.setPrototypeOf(this, ConnectionError.prototype);
    }
}
exports.ConnectionError = ConnectionError;
//# sourceMappingURL=ConnectionError.js.map