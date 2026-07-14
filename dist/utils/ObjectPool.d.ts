export declare class ObjectPool<T> {
    private pool;
    private factory;
    private reset;
    private maxSize;
    constructor(factory: () => T, reset?: (obj: T) => void, maxSize?: number);
    acquire(): T;
    release(obj: T): void;
    getSize(): number;
    getMaxSize(): number;
    setMaxSize(maxSize: number): void;
    clear(): void;
    warmup(count: number): void;
}
//# sourceMappingURL=ObjectPool.d.ts.map