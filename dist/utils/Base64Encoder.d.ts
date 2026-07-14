/// <reference types="node" />
/// <reference types="node" />
export declare class Base64Encoder {
    encode(data: Buffer): string;
    decode(data: string): Buffer;
    encodeURLSafe(data: Buffer): string;
    decodeURLSafe(data: string): Buffer;
    encodeUtf8(text: string): string;
    decodeUtf8(data: string): string;
    isBase64(str: string): boolean;
}
//# sourceMappingURL=Base64Encoder.d.ts.map