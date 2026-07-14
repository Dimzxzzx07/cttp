"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryPolicy = void 0;
class RetryPolicy {
    constructor(maxRetries, initialDelay, maxDelay) {
        this.maxRetries = maxRetries || 3;
        this.initialDelay = initialDelay || 1000;
        this.maxDelay = maxDelay || 30000;
        this.retryableErrors = new Set([
            "ECONNRESET",
            "ECONNREFUSED",
            "ETIMEDOUT",
            "EPIPE",
            "ENOTFOUND",
            "EAI_AGAIN"
        ]);
    }
    async execute(fn) {
        let lastError;
        let delay = this.initialDelay;
        for (let attempt = 0; attempt < this.maxRetries; attempt++) {
            try {
                return await fn();
            }
            catch (error) {
                lastError = error;
                if (!this.shouldRetry(error) || attempt === this.maxRetries - 1) {
                    throw error;
                }
                await this.wait(delay);
                delay = Math.min(delay * 2, this.maxDelay);
            }
        }
        throw lastError;
    }
    shouldRetry(error) {
        if (error instanceof Error) {
            const code = error.code;
            if (code && this.retryableErrors.has(code)) {
                return true;
            }
            if (error.message && error.message.includes("timeout")) {
                return true;
            }
        }
        return false;
    }
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    addRetryableError(code) {
        this.retryableErrors.add(code);
    }
    removeRetryableError(code) {
        this.retryableErrors.delete(code);
    }
    getMaxRetries() {
        return this.maxRetries;
    }
    setMaxRetries(maxRetries) {
        this.maxRetries = maxRetries;
    }
    getInitialDelay() {
        return this.initialDelay;
    }
    setInitialDelay(delay) {
        this.initialDelay = delay;
    }
    getMaxDelay() {
        return this.maxDelay;
    }
    setMaxDelay(delay) {
        this.maxDelay = delay;
    }
    getRetryableErrors() {
        return Array.from(this.retryableErrors);
    }
}
exports.RetryPolicy = RetryPolicy;
//# sourceMappingURL=RetryPolicy.js.map