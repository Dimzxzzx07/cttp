/// <reference types="node" />
/// <reference types="node" />
export declare class HeaderCompressor {
    private constants;
    private bufferUtils;
    private compressionLevel;
    private dictionary;
    constructor();
    private initializeDictionary;
    private hashHeader;
    compress(headers: Map<string, string>): Buffer;
    decompress(data: Buffer): Map<string, string>;
    private encodeHeader;
    private decodeHeader;
    private compressBuffer;
    private decompressBuffer;
    private findKeyByHash;
    setCompressionLevel(level: number): void;
    getCompressionLevel(): number;
    getDictionarySize(): number;
    addToDictionary(key: string): void;
    removeFromDictionary(key: string): void;
}
//# sourceMappingURL=HeaderCompressor.d.ts.map