export declare class Barrier {
    private count;
    private initialCount;
    private waiting;
    private isBroken;
    constructor(count: number);
    wait(): Promise<void>;
    private releaseAll;
    break(): void;
    reset(): void;
    getCount(): number;
    getInitialCount(): number;
    getWaitingCount(): number;
    isBrokenState(): boolean;
}
//# sourceMappingURL=Barrier.d.ts.map