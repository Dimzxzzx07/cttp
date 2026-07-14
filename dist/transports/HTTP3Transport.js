"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP3Transport = void 0;
const CTTPResponse_1 = require("../core/CTTPResponse");
const HTTPVersion_1 = require("../core/HTTPVersion");
class HTTP3Transport {
    constructor(connection) {
        this.connection = connection;
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
    async close() {
        await this.connection.close();
    }
}
exports.HTTP3Transport = HTTP3Transport;
//# sourceMappingURL=HTTP3Transport.js.map