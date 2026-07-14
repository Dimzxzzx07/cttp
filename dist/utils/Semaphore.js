"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Semaphore = void 0;
class Semaphore {
    constructor(maxCount) {
        this.count = maxCount;
        this.maxCount = maxCount;
        this.queue = [];
    }
    async acquire() {
        if (this.count > 0) {
            this.count--;
            return;
        }
        return new Promise((resolve) => {
            this.queue.push(resolve);
        });
    }
    release() {
        if (this.queue.length > 0) {
            const next = this.queue.shift();
            if (next) {
                next();
            }
        }
        else {
            this.count = Math.min(this.count + 1, this.maxCount);
        }
    }
    getAvailable() {
        return this.count;
    }
    getQueueLength() {
        return this.queue.length;
    }
    getMaxCount() {
        return this.maxCount;
    }
    setMaxCount(maxCount) {
        this.maxCount = maxCount;
        this.count = Math.min(this.count, this.maxCount);
    }
    clear() {
        this.queue = [];
        this.count = this.maxCount;
    }
}
exports.Semaphore = Semaphore;
//# sourceMappingURL=Semaphore.js.map