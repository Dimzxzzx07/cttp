/// <reference types="node" />
/// <reference types="node" />
export declare class BufferUtils {
    concat(buffers: Buffer[]): Buffer;
    slice(buffer: Buffer, start: number, end?: number): Buffer;
    copy(source: Buffer, target: Buffer, targetStart?: number, sourceStart?: number, sourceEnd?: number): number;
    equals(a: Buffer, b: Buffer): boolean;
    compare(a: Buffer, b: Buffer): number;
    swap16(buffer: Buffer): Buffer;
    swap32(buffer: Buffer): Buffer;
    zero(buffer: Buffer): void;
    isZero(buffer: Buffer): boolean;
    toHex(buffer: Buffer): string;
    fromHex(hex: string): Buffer;
    toBase64(buffer: Buffer): string;
    fromBase64(base64: string): Buffer;
    toUTF8(buffer: Buffer): string;
    fromUTF8(utf8: string): Buffer;
    pad(buffer: Buffer, length: number, value?: number): Buffer;
    truncate(buffer: Buffer, length: number): Buffer;
    split(buffer: Buffer, delimiter: number): Buffer[];
    join(buffers: Buffer[], delimiter: number): Buffer;
}
//# sourceMappingURL=BufferUtils.d.ts.map