export declare class EventEmitter {
    private events;
    private onceEvents;
    private maxListeners;
    constructor(maxListeners?: number);
    on(event: string, listener: Function): void;
    once(event: string, listener: Function): void;
    off(event: string, listener: Function): void;
    emit(event: string, ...args: any[]): void;
    removeAllListeners(event?: string): void;
    listenerCount(event: string): number;
    getMaxListeners(): number;
    setMaxListeners(max: number): void;
    eventNames(): string[];
}
//# sourceMappingURL=EventEmitter.d.ts.map