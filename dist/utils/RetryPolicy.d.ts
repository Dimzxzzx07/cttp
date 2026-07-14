export declare class RetryPolicy {
    private maxRetries;
    private initialDelay;
    private maxDelay;
    private retryableErrors;
    constructor(maxRetries?: number, initialDelay?: number, maxDelay?: number);
    execute<T>(fn: () => Promise<T>): Promise<T>;
    private shouldRetry;
    private wait;
    addRetryableError(code: string): void;
    removeRetryableError(code: string): void;
    getMaxRetries(): number;
    setMaxRetries(maxRetries: number): void;
    getInitialDelay(): number;
    setInitialDelay(delay: number): void;
    getMaxDelay(): number;
    setMaxDelay(delay: number): void;
    getRetryableErrors(): string[];
}
//# sourceMappingURL=RetryPolicy.d.ts.map