"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamManager = void 0;
class StreamManager {
    constructor() {
        this.streams = new Map();
        this.nextStreamId = 1;
        this.maxStreams = 100;
        this.streamStates = new Map();
    }
    allocateStream() {
        const streamId = this.nextStreamId;
        this.nextStreamId += 2;
        this.streams.set(streamId, {});
        this.streamStates.set(streamId, "idle");
        return streamId;
    }
    getStream(streamId) {
        return this.streams.get(streamId);
    }
    closeStream(streamId) {
        this.streams.delete(streamId);
        this.streamStates.delete(streamId);
    }
    getState(streamId) {
        return this.streamStates.get(streamId) || "closed";
    }
    setState(streamId, state) {
        this.streamStates.set(streamId, state);
    }
    getActiveStreams() {
        return this.streams.size;
    }
    getMaxStreams() {
        return this.maxStreams;
    }
    setMaxStreams(max) {
        this.maxStreams = max;
    }
    isStreamOpen(streamId) {
        return this.streams.has(streamId);
    }
    getNextStreamId() {
        return this.nextStreamId;
    }
    reset() {
        this.streams.clear();
        this.streamStates.clear();
        this.nextStreamId = 1;
    }
}
exports.StreamManager = StreamManager;
//# sourceMappingURL=StreamManager.js.map