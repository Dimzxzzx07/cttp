/// <reference types="node" />
/// <reference types="node" />
export declare class ChunkedStreamParser {
    private buffer;
    private state;
    private chunkSize;
    private body;
    private trailer;
    constructor();
    parse(data: Buffer): {
        complete: boolean;
        body: Buffer;
        trailer?: Map<string, string>;
    };
    private reset;
}
//# sourceMappingURL=ChunkedStreamParser.d.ts.map