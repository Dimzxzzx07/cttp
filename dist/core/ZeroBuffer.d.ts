/// <reference types="node" />
/// <reference types="node" />
import { ConfigTypes } from "../types/ConfigTypes";
export declare class ZeroBuffer {
    private config;
    private constants;
    private zeroedBuffers;
    constructor(config: ConfigTypes.ZeroConfig);
    zero(buffer: Buffer): Buffer;
    zeroString(str: string): string;
    zeroObject(obj: any): any;
    isZeroed(buffer: Buffer): boolean;
    getZeroedCount(): number;
    clear(): void;
}
//# sourceMappingURL=ZeroBuffer.d.ts.map