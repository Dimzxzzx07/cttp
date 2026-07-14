"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP2Transport = void 0;
const CTTPResponse_1 = require("../core/CTTPResponse");
const HTTPVersion_1 = require("../core/HTTPVersion");
const Constants_1 = require("../core/Constants");
const HPACKEncoder_1 = require("../core/HPACKEncoder");
const FrameBuilder_1 = require("../core/FrameBuilder");
class HTTP2Transport {
    constructor(connection) {
        this.connection = connection;
        this.constants = new Constants_1.Constants();
        this.hpackEncoder = new HPACKEncoder_1.HPACKEncoder();
        this.frameBuilder = new FrameBuilder_1.FrameBuilder();
        this.streams = new Map();
        this.nextStreamId = 1;
        this.settings = {
            headerTableSize: 4096,
            enablePush: true,
            maxConcurrentStreams: 100,
            initialWindowSize: 65535,
            maxFrameSize: 16384
        };
    }
    async send(request) {
        const streamId = this.allocateStream();
        const headers = request.getHeaders();
        const encodedHeaders = this.hpackEncoder.encode(headers);
        const headerFrame = this.frameBuilder.buildHeaders(streamId, encodedHeaders, true);
        await this.connection.write(headerFrame);
        const body = request.getBody();
        if (body) {
            const bodyBuffer = this.createBodyBuffer(body);
            const dataFrame = this.frameBuilder.buildData(streamId, bodyBuffer, true);
            await this.connection.write(dataFrame);
        }
        return this.waitForResponse(streamId);
    }
    allocateStream() {
        const id = this.nextStreamId;
        this.nextStreamId += 2;
        this.streams.set(id, { headers: new Map(), body: Buffer.alloc(0), complete: false });
        return id;
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
    async waitForResponse(streamId) {
        return new Promise((resolve, reject) => {
            const readLoop = async () => {
                try {
                    while (true) {
                        const data = await this.connection.read();
                        const frames = this.frameBuilder.parse(data);
                        for (const frame of frames) {
                            if (frame.streamId === streamId) {
                                const stream = this.streams.get(streamId);
                                if (!stream)
                                    continue;
                                if (frame.type === "headers") {
                                    const headers = this.hpackEncoder.decode(frame.payload);
                                    for (const [key, value] of headers) {
                                        stream.headers.set(key, value);
                                    }
                                }
                                else if (frame.type === "data") {
                                    stream.body = Buffer.concat([stream.body, frame.payload]);
                                }
                                else if (frame.type === "end_stream" || (frame.flags & 0x01)) {
                                    stream.complete = true;
                                    const status = parseInt(stream.headers.get(":status") || "200", 10);
                                    const statusText = stream.headers.get("status-text") || "";
                                    const response = new CTTPResponse_1.CTTPResponse(status, statusText, HTTPVersion_1.HTTPVersion.HTTP_2, stream.headers, stream.body);
                                    this.streams.delete(streamId);
                                    resolve(response);
                                    return;
                                }
                            }
                        }
                    }
                }
                catch (error) {
                    reject(error);
                }
            };
            readLoop();
        });
    }
    async close() {
        await this.connection.close();
        this.streams.clear();
    }
}
exports.HTTP2Transport = HTTP2Transport;
//# sourceMappingURL=HTTP2Transport.js.map