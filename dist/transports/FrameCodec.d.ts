/// <reference types="node" />
/// <reference types="node" />
export declare class FrameCodec {
    private maxFrameSize;
    constructor(maxFrameSize?: number);
    encode(data: Buffer, type: number, flags: number, streamId: number): Buffer;
    decode(buffer: Buffer): any[];
    encodeHeaders(streamId: number, headers: Buffer, endStream: boolean): Buffer;
    encodeData(streamId: number, data: Buffer, endStream: boolean): Buffer;
    encodeSettings(settings: Map<number, number>): Buffer;
    encodePing(data: Buffer, ack: boolean): Buffer;
    encodeGoAway(lastStreamId: number, errorCode: number): Buffer;
    encodeWindowUpdate(streamId: number, increment: number): Buffer;
    getMaxFrameSize(): number;
    setMaxFrameSize(size: number): void;
}
//# sourceMappingURL=FrameCodec.d.ts.map