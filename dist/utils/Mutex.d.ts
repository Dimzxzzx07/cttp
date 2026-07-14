export declare class Mutex {
    private locked;
    private queue;
    constructor();
    acquire(): Promise<void>;
    release(): void;
    isLocked(): boolean;
    getQueueLength(): number;
    clear(): void;
}
//# sourceMappingURL=Mutex.d.ts.map