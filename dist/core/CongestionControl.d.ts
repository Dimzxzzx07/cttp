export declare class CongestionControl {
    private cwnd;
    private ssthresh;
    private rtt;
    private rttVar;
    private rto;
    private lossCount;
    private mode;
    constructor();
    onPacketAcked(): void;
    onPacketLost(): void;
    onTimeout(): void;
    updateRTT(sampleRTT: number): void;
    getCWND(): number;
    getSsthresh(): number;
    getRTO(): number;
    getMode(): string;
    getLossCount(): number;
    isCongested(): boolean;
    getSlowStartThreshold(): number;
    setSlowStartThreshold(threshold: number): void;
    getCongestionWindow(): number;
    setCongestionWindow(cwnd: number): void;
    reset(): void;
    getRTT(): number;
    getRTTVar(): number;
}
//# sourceMappingURL=CongestionControl.d.ts.map