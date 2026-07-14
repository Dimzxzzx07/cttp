"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TTLMap = void 0;
class TTLMap {
    constructor(defaultTTL) {
        this.map = new Map();
        this.timers = new Map();
        this.defaultTTL = defaultTTL || 60000;
    }
    set(key, value, ttl) {
        this.map.set(key, value);
        const timeout = ttl || this.defaultTTL;
        this.timers.set(key, Date.now() + timeout);
    }
    get(key) {
        if (this.isExpired(key)) {
            this.delete(key);
            return undefined;
        }
        return this.map.get(key);
    }
    has(key) {
        if (this.isExpired(key)) {
            this.delete(key);
            return false;
        }
        return this.map.has(key);
    }
    delete(key) {
        this.timers.delete(key);
        return this.map.delete(key);
    }
    clear() {
        this.map.clear();
        this.timers.clear();
    }
    keys() {
        this.clean();
        return Array.from(this.map.keys());
    }
    values() {
        this.clean();
        return Array.from(this.map.values());
    }
    entries() {
        this.clean();
        return Array.from(this.map.entries());
    }
    size() {
        this.clean();
        return this.map.size;
    }
    isExpired(key) {
        const expiry = this.timers.get(key);
        if (!expiry) {
            return true;
        }
        return Date.now() > expiry;
    }
    clean() {
        const now = Date.now();
        for (const [key, expiry] of this.timers) {
            if (now > expiry) {
                this.map.delete(key);
                this.timers.delete(key);
            }
        }
    }
    getTTL(key) {
        const expiry = this.timers.get(key);
        if (!expiry) {
            return -1;
        }
        return Math.max(0, expiry - Date.now());
    }
    setDefaultTTL(ttl) {
        this.defaultTTL = ttl;
    }
    getDefaultTTL() {
        return this.defaultTTL;
    }
    refresh(key) {
        const expiry = this.timers.get(key);
        if (expiry) {
            this.timers.set(key, Date.now() + this.defaultTTL);
        }
    }
}
exports.TTLMap = TTLMap;
//# sourceMappingURL=TTLMap.js.map