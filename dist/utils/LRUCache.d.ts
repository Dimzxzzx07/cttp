export declare class LRUCache<K, V> {
    private cache;
    private maxSize;
    constructor(maxSize: number);
    get(key: K): V | undefined;
    set(key: K, value: V): void;
    has(key: K): boolean;
    delete(key: K): boolean;
    clear(): void;
    size(): number;
    getMaxSize(): number;
    setMaxSize(maxSize: number): void;
    keys(): K[];
    values(): V[];
    entries(): [K, V][];
    getStats(): any;
}
//# sourceMappingURL=LRUCache.d.ts.map