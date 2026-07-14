"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamHandler = void 0;
const CTTPResponse_1 = require("../core/CTTPResponse");
const HTTPVersion_1 = require("../core/HTTPVersion");
class StreamHandler {
    constructor() {
        this.streams = new Map();
        this.eventListeners = new Map();
    }
    async handle(request) {
        const body = request.getBody();
        const event = body?.event || "data";
        const data = body?.data || {};
        const encoding = body?.encoding || "json";
        const streamId = body?.streamId || this.generateStreamId();
        if (!this.streams.has(streamId)) {
            this.streams.set(streamId, {
                id: streamId,
                event,
                encoding,
                data: [],
                listeners: new Set(),
                status: "active",
                createdAt: Date.now()
            });
        }
        const stream = this.streams.get(streamId);
        const chunk = this.encodeData(data, encoding);
        stream.data.push(chunk);
        this.emitEvent(streamId, event, data);
        return new CTTPResponse_1.CTTPResponse(200, "OK", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([
            ["Content-Type", "text/event-stream"],
            ["Cache-Control", "no-cache"],
            ["Connection", "keep-alive"]
        ]), {
            streamId,
            event,
            data: chunk,
            timestamp: Date.now(),
            status: "streaming"
        });
    }
    generateStreamId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
    encodeData(data, encoding) {
        if (Buffer.isBuffer(data)) {
            return data;
        }
        if (typeof data === "string") {
            return Buffer.from(data, encoding === "base64" ? "base64" : "utf8");
        }
        return Buffer.from(JSON.stringify(data), "utf8");
    }
    emitEvent(streamId, event, data) {
        const listeners = this.eventListeners.get(`${streamId}:${event}`) || [];
        for (const listener of listeners) {
            try {
                listener(data);
            }
            catch (error) {
                console.error("Stream listener error:", error);
            }
        }
    }
    on(streamId, event, callback) {
        const key = `${streamId}:${event}`;
        if (!this.eventListeners.has(key)) {
            this.eventListeners.set(key, []);
        }
        this.eventListeners.get(key).push(callback);
    }
    off(streamId, event, callback) {
        const key = `${streamId}:${event}`;
        const listeners = this.eventListeners.get(key);
        if (listeners) {
            const index = listeners.indexOf(callback);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }
    }
    getStream(streamId) {
        return this.streams.get(streamId);
    }
    getStreams() {
        return Array.from(this.streams.values());
    }
    closeStream(streamId) {
        const stream = this.streams.get(streamId);
        if (stream) {
            stream.status = "closed";
            this.streams.delete(streamId);
        }
    }
    closeAll() {
        for (const [id, stream] of this.streams) {
            stream.status = "closed";
        }
        this.streams.clear();
        this.eventListeners.clear();
    }
    getStreamData(streamId) {
        const stream = this.streams.get(streamId);
        return stream ? stream.data : [];
    }
    clearStreamData(streamId) {
        const stream = this.streams.get(streamId);
        if (stream) {
            stream.data = [];
        }
    }
}
exports.StreamHandler = StreamHandler;
//# sourceMappingURL=StreamHandler.js.map