export declare class StreamManager {
    private streams;
    private nextStreamId;
    private maxStreams;
    private streamStates;
    constructor();
    allocateStream(): number;
    getStream(streamId: number): any;
    closeStream(streamId: number): void;
    getState(streamId: number): string;
    setState(streamId: number, state: string): void;
    getActiveStreams(): number;
    getMaxStreams(): number;
    setMaxStreams(max: number): void;
    isStreamOpen(streamId: number): boolean;
    getNextStreamId(): number;
    reset(): void;
}
//# sourceMappingURL=StreamManager.d.ts.map