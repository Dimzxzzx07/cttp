export declare class Semaphore {
    private count;
    private maxCount;
    private queue;
    constructor(maxCount: number);
    acquire(): Promise<void>;
    release(): void;
    getAvailable(): number;
    getQueueLength(): number;
    getMaxCount(): number;
    setMaxCount(maxCount: number): void;
    clear(): void;
}
//# sourceMappingURL=Semaphore.d.ts.map