"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManager = void 0;
class CacheManager {
    constructor(maxSize, ttl) {
        this.cache = new Map();
        this.maxSize = maxSize || 1000;
        this.ttl = ttl || 3600000;
    }
    set(key, value, ttl) {
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey) {
                this.cache.delete(firstKey);
            }
        }
        const entry = {
            value,
            timestamp: Date.now(),
            ttl: ttl || this.ttl
        };
        this.cache.set(key, entry);
    }
    get(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            return undefined;
        }
        const elapsed = Date.now() - entry.timestamp;
        if (elapsed > entry.ttl) {
            this.cache.delete(key);
            return undefined;
        }
        return entry.value;
    }
    has(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            return false;
        }
        const elapsed = Date.now() - entry.timestamp;
        if (elapsed > entry.ttl) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }
    remove(key) {
        this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
    getSize() {
        this.cleanExpired();
        return this.cache.size;
    }
    getMaxSize() {
        return this.maxSize;
    }
    setMaxSize(maxSize) {
        this.maxSize = maxSize;
        while (this.cache.size > this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey) {
                this.cache.delete(firstKey);
            }
        }
    }
    getTTL() {
        return this.ttl;
    }
    setTTL(ttl) {
        this.ttl = ttl;
    }
    cleanExpired() {
        const now = Date.now();
        for (const [key, entry] of this.cache) {
            if (now - entry.timestamp > entry.ttl) {
                this.cache.delete(key);
            }
        }
    }
    getKeys() {
        return Array.from(this.cache.keys());
    }
    getStats() {
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            ttl: this.ttl,
            entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
                key,
                timestamp: entry.timestamp,
                age: Date.now() - entry.timestamp,
                ttl: entry.ttl,
                expired: Date.now() - entry.timestamp > entry.ttl
            }))
        };
    }
}
exports.CacheManager = CacheManager;
//# sourceMappingURL=CacheManager.js.map