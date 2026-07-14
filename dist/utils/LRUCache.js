"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LRUCache = void 0;
class LRUCache {
    constructor(maxSize) {
        this.cache = new Map();
        this.maxSize = maxSize;
    }
    get(key) {
        if (!this.cache.has(key)) {
            return undefined;
        }
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
    }
    set(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
        else if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey !== undefined) {
                this.cache.delete(firstKey);
            }
        }
        this.cache.set(key, value);
    }
    has(key) {
        return this.cache.has(key);
    }
    delete(key) {
        return this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
    size() {
        return this.cache.size;
    }
    getMaxSize() {
        return this.maxSize;
    }
    setMaxSize(maxSize) {
        this.maxSize = maxSize;
        while (this.cache.size > this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey !== undefined) {
                this.cache.delete(firstKey);
            }
        }
    }
    keys() {
        return Array.from(this.cache.keys());
    }
    values() {
        return Array.from(this.cache.values());
    }
    entries() {
        return Array.from(this.cache.entries());
    }
    getStats() {
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            utilization: (this.cache.size / this.maxSize) * 100
        };
    }
}
exports.LRUCache = LRUCache;
//# sourceMappingURL=LRUCache.js.map