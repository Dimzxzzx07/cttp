"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP11Session = void 0;
const CTTPResponse_1 = require("./CTTPResponse");
const HTTPVersion_1 = require("./HTTPVersion");
const Constants_1 = require("./Constants");
const ChunkedStreamParser_1 = require("./ChunkedStreamParser");
class HTTP11Session {
    constructor(connection, tlsSession) {
        this.connection = connection;
        this.tlsSession = tlsSession;
        this.constants = new Constants_1.Constants();
        this.chunkedParser = new ChunkedStreamParser_1.ChunkedStreamParser();
        this.keepAlive = true;
        this.pipelining = false;
    }
    async send(request) {
        const socket = this.connection.getSocket();
        const requestBuffer = this.buildRequestBuffer(request);
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error("Request timeout"));
            }, request.getTimeout() || 30000);
            socket.write(requestBuffer, async (err) => {
                if (err) {
                    clearTimeout(timeout);
                    reject(err);
                    return;
                }
                try {
                    const response = await this.readResponse(socket);
                    clearTimeout(timeout);
                    resolve(response);
                }
                catch (error) {
                    clearTimeout(timeout);
                    reject(error);
                }
            });
        });
    }
    buildRequestBuffer(request) {
        const method = request.getMethod();
        const path = request.getPath();
        const version = HTTPVersion_1.HTTPVersion.HTTP_1_1;
        const headers = request.getHeaders();
        const body = request.getBody();
        let requestLine = `${method} ${path} ${version}\r\n`;
        let headerString = "";
        for (const [key, value] of headers) {
            headerString += `${key}: ${value}\r\n`;
        }
        let bodyString = "";
        if (body) {
            if (typeof body === "string") {
                bodyString = body;
            }
            else if (Buffer.isBuffer(body)) {
                bodyString = body.toString();
            }
            else {
                bodyString = JSON.stringify(body);
            }
        }
        const fullRequest = `${requestLine}${headerString}\r\n${bodyString}`;
        return Buffer.from(fullRequest);
    }
    async readResponse(socket) {
        let buffer = Buffer.alloc(0);
        let headersComplete = false;
        let contentLength = -1;
        let chunked = false;
        let status = 0;
        let statusText = "";
        let headers = new Map();
        let body = Buffer.alloc(0);
        return new Promise((resolve, reject) => {
            const onData = (data) => {
                buffer = Buffer.concat([buffer, data]);
                if (!headersComplete) {
                    const headerEnd = buffer.indexOf("\r\n\r\n");
                    if (headerEnd !== -1) {
                        const headerPart = buffer.subarray(0, headerEnd);
                        const bodyPart = buffer.subarray(headerEnd + 4);
                        const lines = headerPart.toString().split("\r\n");
                        const statusLine = lines[0].split(" ");
                        status = parseInt(statusLine[1], 10);
                        statusText = statusLine.slice(2).join(" ") || "";
                        for (let i = 1; i < lines.length; i++) {
                            const [key, ...valueParts] = lines[i].split(":");
                            if (key && valueParts.length > 0) {
                                headers.set(key.trim(), valueParts.join(":").trim());
                            }
                        }
                        const contentLengthHeader = headers.get("content-length");
                        const transferEncoding = headers.get("transfer-encoding");
                        if (contentLengthHeader) {
                            contentLength = parseInt(contentLengthHeader, 10);
                        }
                        if (transferEncoding && transferEncoding.includes("chunked")) {
                            chunked = true;
                        }
                        headersComplete = true;
                        buffer = bodyPart;
                        if (contentLength === 0) {
                            resolve(new CTTPResponse_1.CTTPResponse(status, statusText, HTTPVersion_1.HTTPVersion.HTTP_1_1, headers, ""));
                            socket.removeListener("data", onData);
                            return;
                        }
                    }
                }
                if (headersComplete) {
                    if (chunked) {
                        const parsed = this.chunkedParser.parse(buffer);
                        if (parsed.complete) {
                            body = parsed.body;
                            resolve(new CTTPResponse_1.CTTPResponse(status, statusText, HTTPVersion_1.HTTPVersion.HTTP_1_1, headers, body));
                            socket.removeListener("data", onData);
                        }
                    }
                    else if (contentLength !== -1) {
                        if (buffer.length >= contentLength) {
                            body = buffer.subarray(0, contentLength);
                            resolve(new CTTPResponse_1.CTTPResponse(status, statusText, HTTPVersion_1.HTTPVersion.HTTP_1_1, headers, body));
                            socket.removeListener("data", onData);
                        }
                    }
                }
            };
            socket.on("data", onData);
            socket.on("error", (err) => {
                socket.removeListener("data", onData);
                reject(err);
            });
            socket.on("end", () => {
                socket.removeListener("data", onData);
                if (!headersComplete) {
                    reject(new Error("Connection closed before headers complete"));
                }
            });
        });
    }
    async close() {
        if (this.connection && this.connection.getSocket()) {
            this.connection.getSocket().destroy();
        }
    }
    setKeepAlive(keepAlive) {
        this.keepAlive = keepAlive;
    }
    setPipelining(pipelining) {
        this.pipelining = pipelining;
    }
}
exports.HTTP11Session = HTTP11Session;
//# sourceMappingURL=HTTP11Session.js.map