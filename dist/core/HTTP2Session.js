"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP2Session = void 0;
const CTTPResponse_1 = require("./CTTPResponse");
const HTTPVersion_1 = require("./HTTPVersion");
const Constants_1 = require("./Constants");
const HPACKEncoder_1 = require("./HPACKEncoder");
const FrameBuilder_1 = require("./FrameBuilder");
const StreamManager_1 = require("./StreamManager");
const FlowController_1 = require("./FlowController");
class HTTP2Session {
    constructor(connection, tlsSession) {
        this.connection = connection;
        this.tlsSession = tlsSession;
        this.constants = new Constants_1.Constants();
        this.hpackEncoder = new HPACKEncoder_1.HPACKEncoder();
        this.frameBuilder = new FrameBuilder_1.FrameBuilder();
        this.streamManager = new StreamManager_1.StreamManager();
        this.flowController = new FlowController_1.FlowController();
        this.streams = new Map();
        this.settings = {
            headerTableSize: 4096,
            enablePush: true,
            maxConcurrentStreams: 100,
            initialWindowSize: 65535,
            maxFrameSize: 16384,
            maxHeaderListSize: 65536
        };
    }
    async send(request) {
        const streamId = this.streamManager.allocateStream();
        const headers = this.hpackEncoder.encode(request.getHeaders());
        const headerFrame = this.frameBuilder.buildHeaders(streamId, headers, true);
        return new Promise((resolve, reject) => {
            const socket = this.connection.getSocket();
            const timeout = setTimeout(() => {
                reject(new Error("Request timeout"));
            }, request.getTimeout() || 30000);
            socket.write(headerFrame, (err) => {
                if (err) {
                    clearTimeout(timeout);
                    reject(err);
                    return;
                }
                const body = request.getBody();
                if (body) {
                    const bodyBuffer = this.createBodyBuffer(body);
                    const dataFrame = this.frameBuilder.buildData(streamId, bodyBuffer, true);
                    socket.write(dataFrame);
                }
                this.waitForResponse(streamId, socket, timeout, resolve, reject);
            });
        });
    }
    createBodyBuffer(body) {
        if (Buffer.isBuffer(body)) {
            return body;
        }
        if (typeof body === "string") {
            return Buffer.from(body);
        }
        return Buffer.from(JSON.stringify(body));
    }
    waitForResponse(streamId, socket, timeout, resolve, reject) {
        const onData = (data) => {
            const frames = this.frameBuilder.parse(data);
            for (const frame of frames) {
                if (frame.streamId === streamId) {
                    if (frame.type === "headers") {
                        const headers = this.hpackEncoder.decode(frame.payload);
                        const status = parseInt(headers.get(":status") || "0", 10);
                        const statusText = headers.get("status-text") || "";
                        const responseHeaders = new Map();
                        for (const [key, value] of headers) {
                            if (!key.startsWith(":")) {
                                responseHeaders.set(key, value);
                            }
                        }
                        this.streams.set(streamId, { headers: responseHeaders, body: Buffer.alloc(0) });
                    }
                    else if (frame.type === "data") {
                        const stream = this.streams.get(streamId);
                        if (stream) {
                            stream.body = Buffer.concat([stream.body, frame.payload]);
                            this.streams.set(streamId, stream);
                        }
                    }
                    else if (frame.type === "end_stream") {
                        const stream = this.streams.get(streamId);
                        if (stream) {
                            clearTimeout(timeout);
                            socket.removeListener("data", onData);
                            const response = new CTTPResponse_1.CTTPResponse(parseInt(stream.headers.get(":status") || "200", 10), stream.headers.get("status-text") || "", HTTPVersion_1.HTTPVersion.HTTP_2, stream.headers, stream.body);
                            this.streams.delete(streamId);
                            resolve(response);
                        }
                    }
                }
            }
        };
        socket.on("data", onData);
        socket.on("error", (err) => {
            clearTimeout(timeout);
            socket.removeListener("data", onData);
            reject(err);
        });
    }
    async close() {
        if (this.connection && this.connection.getSocket()) {
            this.connection.getSocket().destroy();
        }
        this.streams.clear();
    }
}
exports.HTTP2Session = HTTP2Session;
//# sourceMappingURL=HTTP2Session.js.map