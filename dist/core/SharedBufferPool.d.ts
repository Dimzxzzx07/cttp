/// <reference types="node" />
/// <reference types="node" />
import { ConfigTypes } from "../types/ConfigTypes";
export declare class SharedBufferPool {
    private config;
    private constants;
    private pools;
    private poolSizes;
    private maxPoolSize;
    constructor(config: ConfigTypes.BufferConfig);
    acquire(size: number): Buffer;
    release(buffer: Buffer): void;
    private updatePoolSize;
    getPoolSize(size: number): number;
    getTotalSize(): number;
    getPoolCount(): number;
    clear(): void;
    setMaxPoolSize(size: number): void;
    getMaxPoolSize(): number;
}
//# sourceMappingURL=SharedBufferPool.d.ts.map