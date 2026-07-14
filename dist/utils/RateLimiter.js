"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
class RateLimiter {
    constructor(limit, interval) {
        this.limit = limit || 100;
        this.interval = interval || 60000;
        this.tokens = this.limit;
        this.lastRefill = Date.now();
    }
    async wait() {
        this.refill();
        if (this.tokens > 0) {
            this.tokens--;
            return;
        }
        const waitTime = this.interval / this.limit;
        await this.sleep(waitTime);
        return this.wait();
    }
    async tryConsume() {
        this.refill();
        if (this.tokens > 0) {
            this.tokens--;
            return true;
        }
        return false;
    }
    refill() {
        const now = Date.now();
        const elapsed = now - this.lastRefill;
        const refill = Math.floor(elapsed / (this.interval / this.limit));
        if (refill > 0) {
            this.tokens = Math.min(this.limit, this.tokens + refill);
            this.lastRefill = now;
        }
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    getTokens() {
        this.refill();
        return this.tokens;
    }
    getLimit() {
        return this.limit;
    }
    setLimit(limit) {
        this.limit = limit;
        this.tokens = Math.min(this.tokens, this.limit);
    }
    getInterval() {
        return this.interval;
    }
    setInterval(interval) {
        this.interval = interval;
    }
    reset() {
        this.tokens = this.limit;
        this.lastRefill = Date.now();
    }
}
exports.RateLimiter = RateLimiter;
//# sourceMappingURL=RateLimiter.js.map