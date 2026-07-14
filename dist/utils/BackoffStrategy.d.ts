export declare class BackoffStrategy {
    private baseDelay;
    private maxDelay;
    private multiplier;
    private jitter;
    constructor(baseDelay?: number, maxDelay?: number, multiplier?: number, jitter?: boolean);
    getDelay(attempt: number): number;
    reset(): void;
    getBaseDelay(): number;
    setBaseDelay(delay: number): void;
    getMaxDelay(): number;
    setMaxDelay(delay: number): void;
    getMultiplier(): number;
    setMultiplier(multiplier: number): void;
    hasJitter(): boolean;
    setJitter(jitter: boolean): void;
}
//# sourceMappingURL=BackoffStrategy.d.ts.map