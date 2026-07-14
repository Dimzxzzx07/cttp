export declare class StringPool {
    private pool;
    private maxSize;
    constructor(maxSize?: number);
    intern(str: string): string;
    contains(str: string): boolean;
    getSize(): number;
    getMaxSize(): number;
    setMaxSize(maxSize: number): void;
    clear(): void;
    keys(): string[];
    getStats(): any;
}
//# sourceMappingURL=StringPool.d.ts.map