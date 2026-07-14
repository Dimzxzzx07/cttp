export declare class TTLMap<K, V> {
    private map;
    private timers;
    private defaultTTL;
    constructor(defaultTTL?: number);
    set(key: K, value: V, ttl?: number): void;
    get(key: K): V | undefined;
    has(key: K): boolean;
    delete(key: K): boolean;
    clear(): void;
    keys(): K[];
    values(): V[];
    entries(): [K, V][];
    size(): number;
    private isExpired;
    private clean;
    getTTL(key: K): number;
    setDefaultTTL(ttl: number): void;
    getDefaultTTL(): number;
    refresh(key: K): void;
}
//# sourceMappingURL=TTLMap.d.ts.map