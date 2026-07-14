"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowController = void 0;
class FlowController {
    constructor() {
        this.windowSize = 65535;
        this.initialWindowSize = 65535;
        this.usedWindow = 0;
        this.maxWindowSize = 2147483647;
        this.streamWindows = new Map();
    }
    updateWindowSize(windowSize) {
        this.windowSize = Math.min(windowSize, this.maxWindowSize);
    }
    getWindowSize() {
        return this.windowSize;
    }
    getAvailableWindow() {
        return this.windowSize - this.usedWindow;
    }
    consumeWindow(size) {
        if (this.usedWindow + size <= this.windowSize) {
            this.usedWindow += size;
            return true;
        }
        return false;
    }
    releaseWindow(size) {
        this.usedWindow = Math.max(0, this.usedWindow - size);
    }
    resetWindow() {
        this.usedWindow = 0;
        this.windowSize = this.initialWindowSize;
    }
    getStreamWindow(streamId) {
        return this.streamWindows.get(streamId) || this.initialWindowSize;
    }
    updateStreamWindow(streamId, windowSize) {
        this.streamWindows.set(streamId, Math.min(windowSize, this.maxWindowSize));
    }
    getStreamAvailable(streamId) {
        const window = this.getStreamWindow(streamId);
        const used = this.getStreamUsed(streamId);
        return window - used;
    }
    getStreamUsed(streamId) {
        return 0;
    }
    consumeStreamWindow(streamId, size) {
        const window = this.getStreamWindow(streamId);
        const used = this.getStreamUsed(streamId);
        if (used + size <= window) {
            return true;
        }
        return false;
    }
    releaseStreamWindow(streamId, size) {
    }
    resetStreamWindow(streamId) {
        this.streamWindows.delete(streamId);
    }
    setInitialWindowSize(size) {
        this.initialWindowSize = Math.min(size, this.maxWindowSize);
        this.windowSize = this.initialWindowSize;
    }
    getInitialWindowSize() {
        return this.initialWindowSize;
    }
    getMaxWindowSize() {
        return this.maxWindowSize;
    }
    setMaxWindowSize(size) {
        this.maxWindowSize = size;
    }
    isWindowFull() {
        return this.getAvailableWindow() <= 0;
    }
    isStreamWindowFull(streamId) {
        return this.getStreamAvailable(streamId) <= 0;
    }
}
exports.FlowController = FlowController;
//# sourceMappingURL=FlowController.js.map