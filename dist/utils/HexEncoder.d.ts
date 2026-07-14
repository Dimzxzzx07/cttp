/// <reference types="node" />
/// <reference types="node" />
export declare class HexEncoder {
    encode(data: Buffer): string;
    decode(data: string): Buffer;
    encodeUtf8(text: string): string;
    decodeUtf8(data: string): string;
    isHex(str: string): boolean;
    toByteArray(str: string): number[];
    fromByteArray(bytes: number[]): string;
}
//# sourceMappingURL=HexEncoder.d.ts.map