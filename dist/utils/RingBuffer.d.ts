export declare class RingBuffer<T> {
    private buffer;
    private capacity;
    private head;
    private tail;
    private size;
    constructor(capacity: number);
    push(item: T): void;
    pop(): T | undefined;
    peek(): T | undefined;
    peekLast(): T | undefined;
    clear(): void;
    isEmpty(): boolean;
    isFull(): boolean;
    getSize(): number;
    getCapacity(): number;
    setCapacity(capacity: number): void;
    toArray(): T[];
}
//# sourceMappingURL=RingBuffer.d.ts.map