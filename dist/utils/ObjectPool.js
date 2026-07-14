"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectPool = void 0;
class ObjectPool {
    constructor(factory, reset, maxSize) {
        this.pool = [];
        this.factory = factory;
        this.reset = reset || ((obj) => { });
        this.maxSize = maxSize || 100;
    }
    acquire() {
        if (this.pool.length > 0) {
            const obj = this.pool.pop();
            return obj;
        }
        return this.factory();
    }
    release(obj) {
        if (this.pool.length < this.maxSize) {
            this.reset(obj);
            this.pool.push(obj);
        }
    }
    getSize() {
        return this.pool.length;
    }
    getMaxSize() {
        return this.maxSize;
    }
    setMaxSize(maxSize) {
        this.maxSize = maxSize;
        while (this.pool.length > this.maxSize) {
            this.pool.pop();
        }
    }
    clear() {
        this.pool = [];
    }
    warmup(count) {
        for (let i = 0; i < count && this.pool.length < this.maxSize; i++) {
            const obj = this.factory();
            this.pool.push(obj);
        }
    }
}
exports.ObjectPool = ObjectPool;
//# sourceMappingURL=ObjectPool.js.map