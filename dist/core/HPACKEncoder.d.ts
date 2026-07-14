/// <reference types="node" />
/// <reference types="node" />
export declare class HPACKEncoder {
    private staticTable;
    private dynamicTable;
    private maxTableSize;
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
    clearDynamicTable(): void;
}
//# sourceMappingURL=HPACKEncoder.d.ts.map