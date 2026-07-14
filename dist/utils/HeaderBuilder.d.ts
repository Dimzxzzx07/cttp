/// <reference types="node" />
/// <reference types="node" />
export declare class HeaderBuilder {
    private headers;
    constructor();
    add(key: string, value: string): void;
    set(key: string, value: string): void;
    get(key: string): string | undefined;
    remove(key: string): void;
    has(key: string): boolean;
    clear(): void;
    build(): Map<string, string>;
    toObject(): Record<string, string>;
    fromObject(obj: Record<string, string>): void;
    toBuffer(): Buffer;
    fromBuffer(buffer: Buffer): void;
    clone(): HeaderBuilder;
}
//# sourceMappingURL=HeaderBuilder.d.ts.map