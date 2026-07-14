import { Logger } from "./Logger";
export declare class ErrorHandler {
    private logger;
    private retryableErrors;
    private maxRetries;
    private retryDelay;
    constructor(logger: Logger);
    handle(error: any): void;
    isRetryable(error: any): boolean;
    retry<T>(fn: () => Promise<T>, maxRetries?: number, delay?: number): Promise<T>;
    private sleep;
    setMaxRetries(maxRetries: number): void;
    getMaxRetries(): number;
    setRetryDelay(delay: number): void;
    getRetryDelay(): number;
    addRetryableError(code: string): void;
    removeRetryableError(code: string): void;
}
//# sourceMappingURL=ErrorHandler.d.ts.map