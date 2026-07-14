/// <reference types="node" />
/// <reference types="node" />
export declare class MultipartParser {
    private boundary;
    private buffer;
    private parts;
    private state;
    constructor(boundary: string);
    parse(data: Buffer): any[];
    private processBuffer;
    private parseHeaders;
    getParts(): any[];
    getFiles(): any[];
    getFields(): any[];
    reset(): void;
    isComplete(): boolean;
}
//# sourceMappingURL=MultipartParser.d.ts.map