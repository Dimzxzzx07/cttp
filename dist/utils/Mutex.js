"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutex = void 0;
class Mutex {
    constructor() {
        this.locked = false;
        this.queue = [];
    }
    async acquire() {
        if (!this.locked) {
            this.locked = true;
            return;
        }
        return new Promise((resolve) => {
            this.queue.push(resolve);
        });
    }
    release() {
        if (this.queue.length === 0) {
            this.locked = false;
            return;
        }
        const next = this.queue.shift();
        if (next) {
            next();
        }
    }
    isLocked() {
        return this.locked;
    }
    getQueueLength() {
        return this.queue.length;
    }
    clear() {
        this.queue = [];
        this.locked = false;
    }
}
exports.Mutex = Mutex;
//# sourceMappingURL=Mutex.js.map