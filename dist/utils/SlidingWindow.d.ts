export declare class SlidingWindow {
    private window;
    private size;
    private sum;
    constructor(size: number);
    add(value: number): void;
    getAverage(): number;
    getSum(): number;
    getMin(): number;
    getMax(): number;
    getWindow(): number[];
    getSize(): number;
    getMaxSize(): number;
    setMaxSize(size: number): void;
    clear(): void;
    isFull(): boolean;
}
//# sourceMappingURL=SlidingWindow.d.ts.map