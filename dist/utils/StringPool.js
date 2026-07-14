"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringPool = void 0;
class StringPool {
    constructor(maxSize) {
        this.pool = new Map();
        this.maxSize = maxSize || 10000;
    }
    intern(str) {
        const existing = this.pool.get(str);
        if (existing) {
            return existing;
        }
        if (this.pool.size >= this.maxSize) {
            const firstKey = this.pool.keys().next().value;
            if (firstKey) {
                this.pool.delete(firstKey);
            }
        }
        this.pool.set(str, str);
        return str;
    }
    contains(str) {
        return this.pool.has(str);
    }
    getSize() {
        return this.pool.size;
    }
    getMaxSize() {
        return this.maxSize;
    }
    setMaxSize(maxSize) {
        this.maxSize = maxSize;
        while (this.pool.size > this.maxSize) {
            const firstKey = this.pool.keys().next().value;
            if (firstKey) {
                this.pool.delete(firstKey);
            }
        }
    }
    clear() {
        this.pool.clear();
    }
    keys() {
        return Array.from(this.pool.keys());
    }
    getStats() {
        return {
            size: this.pool.size,
            maxSize: this.maxSize,
            utilization: (this.pool.size / this.maxSize) * 100
        };
    }
}
exports.StringPool = StringPool;
//# sourceMappingURL=StringPool.js.map