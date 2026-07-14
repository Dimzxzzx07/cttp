"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QUICTransport = void 0;
const CTTPResponse_1 = require("../core/CTTPResponse");
const HTTPVersion_1 = require("../core/HTTPVersion");
const Constants_1 = require("../core/Constants");
class QUICTransport {
    constructor(connection) {
        this.connection = connection;
        this.constants = new Constants_1.Constants();
        this.streams = new Map();
    }
    async send(request) {
        const streamId = this.generateStreamId();
        const stream = await this.createStream(streamId);
        const requestBuffer = this.buildRequestBuffer(request);
        await this.sendData(stream, requestBuffer);
        const responseData = await this.receiveData(stream);
        return this.parseResponse(responseData);
    }
    generateStreamId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
    async createStream(streamId) {
        const stream = {
            id: streamId,
            data: Buffer.alloc(0),
            complete: false
        };
        this.streams.set(streamId, stream);
        return stream;
    }
    buildRequestBuffer(request) {
        const method = request.getMethod();
        const url = request.getURL();
        const headers = request.getHeaders();
        const body = request.getBody();
        let requestString = `${method} ${url} HTTP/3\r\n`;
        for (const [key, value] of headers) {
            requestString += `${key}: ${value}\r\n`;
        }
        requestString += "\r\n";
        if (body) {
            if (typeof body === "string") {
                requestString += body;
            }
            else if (Buffer.isBuffer(body)) {
                requestString += body.toString();
            }
            else {
                requestString += JSON.stringify(body);
            }
        }
        return Buffer.from(requestString);
    }
    async sendData(stream, data) {
        await this.connection.write(data);
    }
    async receiveData(stream) {
        const data = await this.connection.read();
        stream.data = Buffer.concat([stream.data, data]);
        return stream.data;
    }
    parseResponse(data) {
        const text = data.toString();
        const lines = text.split("\r\n");
        const statusLine = lines[0].split(" ");
        const status = parseInt(statusLine[1], 10);
        const statusText = statusLine.slice(2).join(" ") || "";
        const headers = new Map();
        let bodyIndex = 0;
        for (let i = 1; i < lines.length; i++) {
            if (lines[i] === "") {
                bodyIndex = i + 1;
                break;
            }
            const [key, ...valueParts] = lines[i].split(":");
            if (key && valueParts.length > 0) {
                headers.set(key.trim(), valueParts.join(":").trim());
            }
        }
        const body = lines.slice(bodyIndex).join("\r\n");
        return new CTTPResponse_1.CTTPResponse(status, statusText, HTTPVersion_1.HTTPVersion.HTTP_3, headers, body);
    }
    async close() {
        await this.connection.close();
        this.streams.clear();
    }
    getStream(streamId) {
        return this.streams.get(streamId);
    }
    getStreams() {
        return Array.from(this.streams.keys());
    }
    removeStream(streamId) {
        this.streams.delete(streamId);
    }
}
exports.QUICTransport = QUICTransport;
//# sourceMappingURL=QUICTransport.js.map