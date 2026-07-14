"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Barrier = void 0;
class Barrier {
    constructor(count) {
        this.count = count;
        this.initialCount = count;
        this.waiting = [];
        this.isBroken = false;
    }
    async wait() {
        if (this.isBroken) {
            throw new Error("Barrier is broken");
        }
        this.count--;
        if (this.count === 0) {
            this.releaseAll();
            return;
        }
        return new Promise((resolve, reject) => {
            this.waiting.push(resolve);
        });
    }
    releaseAll() {
        for (const resolve of this.waiting) {
            resolve();
        }
        this.waiting = [];
        this.count = this.initialCount;
    }
    break() {
        this.isBroken = true;
        for (const resolve of this.waiting) {
            resolve();
        }
        this.waiting = [];
    }
    reset() {
        this.isBroken = false;
        this.count = this.initialCount;
        this.waiting = [];
    }
    getCount() {
        return this.count;
    }
    getInitialCount() {
        return this.initialCount;
    }
    getWaitingCount() {
        return this.waiting.length;
    }
    isBrokenState() {
        return this.isBroken;
    }
}
exports.Barrier = Barrier;
//# sourceMappingURL=Barrier.js.map