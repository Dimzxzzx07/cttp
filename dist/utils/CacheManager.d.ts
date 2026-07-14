export declare class CacheManager {
    private cache;
    private maxSize;
    private ttl;
    constructor(maxSize?: number, ttl?: number);
    set(key: string, value: any, ttl?: number): void;
    get(key: string): any;
    has(key: string): boolean;
    remove(key: string): void;
    clear(): void;
    getSize(): number;
    getMaxSize(): number;
    setMaxSize(maxSize: number): void;
    getTTL(): number;
    setTTL(ttl: number): void;
    cleanExpired(): void;
    getKeys(): string[];
    getStats(): any;
}
//# sourceMappingURL=CacheManager.d.ts.map