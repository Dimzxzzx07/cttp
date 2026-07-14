/// <reference types="node" />
/// <reference types="node" />
export declare class QPACKEncoder {
    private staticTable;
    private dynamicTable;
    private maxTableSize;
    private maxBlockedStreams;
    constructor();
    encode(headers: Map<string, string>): Buffer;
    decode(data: Buffer): Map<string, string>;
    private getStaticIndex;
    private getDynamicIndex;
    private getHeader;
    private addToDynamicTable;
    private getDynamicSize;
    setMaxTableSize(size: number): void;
    getMaxTableSize(): number;
    setMaxBlockedStreams(max: number): void;
    getMaxBlockedStreams(): number;
    clearDynamicTable(): void;
}
//# sourceMappingURL=QPACKEncoder.d.ts.map