"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedBufferPool = void 0;
const Constants_1 = require("./Constants");
class SharedBufferPool {
    constructor(config) {
        this.config = config;
        this.constants = new Constants_1.Constants();
        this.pools = new Map();
        this.poolSizes = new Map();
        this.maxPoolSize = config.maxPoolSize || 100;
    }
    acquire(size) {
        const pool = this.pools.get(size);
        if (pool && pool.length > 0) {
            const buffer = pool.pop();
            this.updatePoolSize(size, -1);
            return buffer;
        }
        return Buffer.allocUnsafe(size);
    }
    release(buffer) {
        const size = buffer.length;
        const pool = this.pools.get(size) || [];
        if (pool.length < this.maxPoolSize) {
            pool.push(buffer);
            this.pools.set(size, pool);
            this.updatePoolSize(size, 1);
        }
    }
    updatePoolSize(size, delta) {
        const current = this.poolSizes.get(size) || 0;
        this.poolSizes.set(size, Math.max(0, current + delta));
    }
    getPoolSize(size) {
        return this.poolSizes.get(size) || 0;
    }
    getTotalSize() {
        let total = 0;
        for (const size of this.poolSizes.values()) {
            total += size;
        }
        return total;
    }
    getPoolCount() {
        return this.pools.size;
    }
    clear() {
        this.pools.clear();
        this.poolSizes.clear();
    }
    setMaxPoolSize(size) {
        this.maxPoolSize = size;
    }
    getMaxPoolSize() {
        return this.maxPoolSize;
    }
}
exports.SharedBufferPool = SharedBufferPool;
//# sourceMappingURL=SharedBufferPool.js.map