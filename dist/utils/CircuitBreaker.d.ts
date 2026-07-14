export declare class CircuitBreaker {
    private state;
    private failureCount;
    private successCount;
    private threshold;
    private timeout;
    private resetTimeout;
    private lastFailureTime;
    constructor(threshold?: number, timeout?: number, resetTimeout?: number);
    execute<T>(fn: () => Promise<T>): Promise<T>;
    private onSuccess;
    private onFailure;
    private reset;
    getState(): string;
    getFailureCount(): number;
    getSuccessCount(): number;
    getThreshold(): number;
    setThreshold(threshold: number): void;
    getTimeout(): number;
    setTimeout(timeout: number): void;
    getResetTimeout(): number;
    setResetTimeout(timeout: number): void;
    forceOpen(): void;
    forceClosed(): void;
    forceHalfOpen(): void;
}
//# sourceMappingURL=CircuitBreaker.d.ts.map