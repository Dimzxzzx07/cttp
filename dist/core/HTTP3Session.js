"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP3Session = void 0;
const CTTPResponse_1 = require("./CTTPResponse");
const HTTPVersion_1 = require("./HTTPVersion");
class HTTP3Session {
    constructor(connection, quicSession) {
        this.connection = connection;
        this.quicSession = quicSession;
    }
    async send(request) {
        const headers = request.getHeaders();
        const headerObj = {};
        for (const [key, value] of headers) {
            headerObj[key] = value;
        }
        const headerData = Buffer.from(JSON.stringify(headerObj));
        return new CTTPResponse_1.CTTPResponse(200, "OK", HTTPVersion_1.HTTPVersion.HTTP_3, new Map(), headerData);
    }
    async close() { }
}
exports.HTTP3Session = HTTP3Session;
//# sourceMappingURL=HTTP3Session.js.map