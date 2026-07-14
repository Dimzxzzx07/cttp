export declare class RateLimiter {
    private limit;
    private interval;
    private tokens;
    private lastRefill;
    constructor(limit?: number, interval?: number);
    wait(): Promise<void>;
    tryConsume(): Promise<boolean>;
    private refill;
    private sleep;
    getTokens(): number;
    getLimit(): number;
    setLimit(limit: number): void;
    getInterval(): number;
    setInterval(interval: number): void;
    reset(): void;
}
//# sourceMappingURL=RateLimiter.d.ts.map