"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackoffStrategy = void 0;
class BackoffStrategy {
    constructor(baseDelay, maxDelay, multiplier, jitter) {
        this.baseDelay = baseDelay || 1000;
        this.maxDelay = maxDelay || 30000;
        this.multiplier = multiplier || 2;
        this.jitter = jitter !== undefined ? jitter : true;
    }
    getDelay(attempt) {
        let delay = this.baseDelay * Math.pow(this.multiplier, attempt);
        delay = Math.min(delay, this.maxDelay);
        if (this.jitter) {
            const jitterAmount = delay * 0.1;
            delay = delay + (Math.random() * jitterAmount * 2 - jitterAmount);
        }
        return Math.max(0, delay);
    }
    reset() {
    }
    getBaseDelay() {
        return this.baseDelay;
    }
    setBaseDelay(delay) {
        this.baseDelay = delay;
    }
    getMaxDelay() {
        return this.maxDelay;
    }
    setMaxDelay(delay) {
        this.maxDelay = delay;
    }
    getMultiplier() {
        return this.multiplier;
    }
    setMultiplier(multiplier) {
        this.multiplier = multiplier;
    }
    hasJitter() {
        return this.jitter;
    }
    setJitter(jitter) {
        this.jitter = jitter;
    }
}
exports.BackoffStrategy = BackoffStrategy;
//# sourceMappingURL=BackoffStrategy.js.map