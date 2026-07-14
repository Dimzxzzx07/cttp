export declare class FlowController {
    private windowSize;
    private initialWindowSize;
    private usedWindow;
    private maxWindowSize;
    private streamWindows;
    constructor();
    updateWindowSize(windowSize: number): void;
    getWindowSize(): number;
    getAvailableWindow(): number;
    consumeWindow(size: number): boolean;
    releaseWindow(size: number): void;
    resetWindow(): void;
    getStreamWindow(streamId: number): number;
    updateStreamWindow(streamId: number, windowSize: number): void;
    getStreamAvailable(streamId: number): number;
    private getStreamUsed;
    consumeStreamWindow(streamId: number, size: number): boolean;
    releaseStreamWindow(streamId: number, size: number): void;
    resetStreamWindow(streamId: number): void;
    setInitialWindowSize(size: number): void;
    getInitialWindowSize(): number;
    getMaxWindowSize(): number;
    setMaxWindowSize(size: number): void;
    isWindowFull(): boolean;
    isStreamWindowFull(streamId: number): boolean;
}
//# sourceMappingURL=FlowController.d.ts.map