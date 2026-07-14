export declare class TimerWheel {
    private wheels;
    private ticks;
    private tickDuration;
    private timerId;
    constructor(tickDuration?: number, ticks?: number);
    private initializeWheels;
    private start;
    private tick;
    schedule(callback: Function, delay: number): void;
    clear(): void;
    stop(): void;
    restart(): void;
    getTickCount(): number;
    getTickDuration(): number;
    getActiveTimers(): number;
    getWheelSize(): number;
}
//# sourceMappingURL=TimerWheel.d.ts.map