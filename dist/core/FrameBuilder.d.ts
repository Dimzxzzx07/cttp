/// <reference types="node" />
/// <reference types="node" />
export declare class FrameBuilder {
    private frameTypes;
    constructor();
    buildHeaders(streamId: number, headers: Buffer, endStream: boolean): Buffer;
    buildData(streamId: number, data: Buffer, endStream: boolean): Buffer;
    buildSettings(settings: Map<number, number>): Buffer;
    buildPing(data: Buffer, ack?: boolean): Buffer;
    buildGoAway(lastStreamId: number, errorCode: number): Buffer;
    buildWindowUpdate(streamId: number, increment: number): Buffer;
    buildRstStream(streamId: number, errorCode: number): Buffer;
    parse(data: Buffer): any[];
    getFrameType(code: number): string;
    getFrameCode(type: string): number;
}
//# sourceMappingURL=FrameBuilder.d.ts.map