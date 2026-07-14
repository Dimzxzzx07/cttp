export declare class BloomFilter {
    private bits;
    private size;
    private hashCount;
    constructor(size: number, hashCount: number);
    add(value: string): void;
    contains(value: string): boolean;
    private getHashes;
    clear(): void;
    getSize(): number;
    getHashCount(): number;
    getBits(): Uint8Array;
    getPopulation(): number;
    getFalsePositiveRate(): number;
}
//# sourceMappingURL=BloomFilter.d.ts.map