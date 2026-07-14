export interface IStreaming {
    stream(url: string, options?: any): Promise<any>;
    on(event: string, callback: Function): void;
    off(event: string, callback: Function): void;
    close(): Promise<void>;
}
//# sourceMappingURL=IStreaming.d.ts.map