"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreaker = void 0;
class CircuitBreaker {
    constructor(threshold, timeout, resetTimeout) {
        this.state = "closed";
        this.failureCount = 0;
        this.successCount = 0;
        this.threshold = threshold || 5;
        this.timeout = timeout || 30000;
        this.resetTimeout = resetTimeout || 60000;
        this.lastFailureTime = 0;
    }
    async execute(fn) {
        if (this.state === "open") {
            if (Date.now() - this.lastFailureTime > this.resetTimeout) {
                this.state = "half-open";
                this.successCount = 0;
            }
            else {
                throw new Error("Circuit breaker is open");
            }
        }
        try {
            const result = await fn();
            this.onSuccess();
            return result;
        }
        catch (error) {
            this.onFailure();
            throw error;
        }
    }
    onSuccess() {
        if (this.state === "half-open") {
            this.successCount++;
            if (this.successCount >= this.threshold) {
                this.reset();
            }
        }
        else {
            this.failureCount = 0;
        }
    }
    onFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        if (this.failureCount >= this.threshold) {
            this.state = "open";
        }
    }
    reset() {
        this.state = "closed";
        this.failureCount = 0;
        this.successCount = 0;
    }
    getState() {
        return this.state;
    }
    getFailureCount() {
        return this.failureCount;
    }
    getSuccessCount() {
        return this.successCount;
    }
    getThreshold() {
        return this.threshold;
    }
    setThreshold(threshold) {
        this.threshold = threshold;
    }
    getTimeout() {
        return this.timeout;
    }
    setTimeout(timeout) {
        this.timeout = timeout;
    }
    getResetTimeout() {
        return this.resetTimeout;
    }
    setResetTimeout(timeout) {
        this.resetTimeout = timeout;
    }
    forceOpen() {
        this.state = "open";
        this.lastFailureTime = Date.now();
    }
    forceClosed() {
        this.state = "closed";
        this.failureCount = 0;
        this.successCount = 0;
    }
    forceHalfOpen() {
        this.state = "half-open";
        this.successCount = 0;
    }
}
exports.CircuitBreaker = CircuitBreaker;
//# sourceMappingURL=CircuitBreaker.js.map