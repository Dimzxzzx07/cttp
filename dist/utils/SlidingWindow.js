"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlidingWindow = void 0;
class SlidingWindow {
    constructor(size) {
        this.window = [];
        this.size = size;
        this.sum = 0;
    }
    add(value) {
        this.window.push(value);
        this.sum += value;
        if (this.window.length > this.size) {
            const removed = this.window.shift();
            if (removed !== undefined) {
                this.sum -= removed;
            }
        }
    }
    getAverage() {
        if (this.window.length === 0) {
            return 0;
        }
        return this.sum / this.window.length;
    }
    getSum() {
        return this.sum;
    }
    getMin() {
        if (this.window.length === 0) {
            return 0;
        }
        return Math.min(...this.window);
    }
    getMax() {
        if (this.window.length === 0) {
            return 0;
        }
        return Math.max(...this.window);
    }
    getWindow() {
        return [...this.window];
    }
    getSize() {
        return this.window.length;
    }
    getMaxSize() {
        return this.size;
    }
    setMaxSize(size) {
        this.size = size;
        while (this.window.length > size) {
            const removed = this.window.shift();
            if (removed !== undefined) {
                this.sum -= removed;
            }
        }
    }
    clear() {
        this.window = [];
        this.sum = 0;
    }
    isFull() {
        return this.window.length === this.size;
    }
}
exports.SlidingWindow = SlidingWindow;
//# sourceMappingURL=SlidingWindow.js.map