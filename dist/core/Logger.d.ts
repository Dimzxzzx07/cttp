export declare class Logger {
    private level;
    private levels;
    private enabled;
    private prefix;
    constructor(level?: string);
    error(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
    trace(message: string, ...args: any[]): void;
    private log;
    private shouldLog;
    setLevel(level: string): void;
    getLevel(): string;
    setEnabled(enabled: boolean): void;
    isEnabled(): boolean;
    setPrefix(prefix: string): void;
    getPrefix(): string;
}
//# sourceMappingURL=Logger.d.ts.map