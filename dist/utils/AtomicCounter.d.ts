export declare class AtomicCounter {
    private value;
    constructor(initialValue?: number);
    increment(): number;
    decrement(): number;
    add(amount: number): number;
    subtract(amount: number): number;
    get(): number;
    set(value: number): void;
    reset(): void;
    compareAndSet(expected: number, newValue: number): boolean;
    getAndIncrement(): number;
    getAndDecrement(): number;
    incrementAndGet(): number;
    decrementAndGet(): number;
    toString(): string;
}
//# sourceMappingURL=AtomicCounter.d.ts.map