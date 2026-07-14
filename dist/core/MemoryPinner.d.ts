/// <reference types="node" />
/// <reference types="node" />
import { ConfigTypes } from "../types/ConfigTypes";
export declare class MemoryPinner {
    private config;
    private constants;
    private pinnedBuffers;
    private memoryLimit;
    private currentUsage;
    constructor(config: ConfigTypes.MemoryConfig);
    pinBuffer(id: string, buffer: Buffer): void;
    getPinnedBuffer(id: string): Buffer | undefined;
    unpinBuffer(id: string): void;
    private unpinLRU;
    private zeroBuffer;
    getMemoryUsage(): number;
    getMemoryLimit(): number;
    setMemoryLimit(limit: number): void;
    getPinnedCount(): number;
    clear(): void;
}
//# sourceMappingURL=MemoryPinner.d.ts.map