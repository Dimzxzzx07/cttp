"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryPinner = void 0;
const Constants_1 = require("./Constants");
class MemoryPinner {
    constructor(config) {
        this.config = config;
        this.constants = new Constants_1.Constants();
        this.pinnedBuffers = new Map();
        this.memoryLimit = config.memoryLimit || 1024 * 1024 * 100;
        this.currentUsage = 0;
    }
    pinBuffer(id, buffer) {
        const size = buffer.length;
        if (this.currentUsage + size > this.memoryLimit) {
            this.unpinLRU();
        }
        const pinnedBuffer = Buffer.allocUnsafe(size);
        buffer.copy(pinnedBuffer);
        this.pinnedBuffers.set(id, pinnedBuffer);
        this.currentUsage += size;
    }
    getPinnedBuffer(id) {
        const buffer = this.pinnedBuffers.get(id);
        if (buffer) {
            return Buffer.from(buffer);
        }
        return undefined;
    }
    unpinBuffer(id) {
        const buffer = this.pinnedBuffers.get(id);
        if (buffer) {
            this.currentUsage -= buffer.length;
            this.pinnedBuffers.delete(id);
            this.zeroBuffer(buffer);
        }
    }
    unpinLRU() {
        if (this.pinnedBuffers.size === 0) {
            return;
        }
        const firstKey = this.pinnedBuffers.keys().next().value;
        if (firstKey) {
            this.unpinBuffer(firstKey);
        }
    }
    zeroBuffer(buffer) {
        buffer.fill(0);
    }
    getMemoryUsage() {
        return this.currentUsage;
    }
    getMemoryLimit() {
        return this.memoryLimit;
    }
    setMemoryLimit(limit) {
        this.memoryLimit = limit;
    }
    getPinnedCount() {
        return this.pinnedBuffers.size;
    }
    clear() {
        for (const id of this.pinnedBuffers.keys()) {
            this.unpinBuffer(id);
        }
        this.pinnedBuffers.clear();
        this.currentUsage = 0;
    }
}
exports.MemoryPinner = MemoryPinner;
//# sourceMappingURL=MemoryPinner.js.map