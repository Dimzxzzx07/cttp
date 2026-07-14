export declare class ResumableUploader {
    private client;
    private config;
    private uploads;
    constructor(config: any);
    upload(url: string, file: string, options?: any): Promise<any>;
    private generateSessionId;
    resume(sessionId: string): Promise<void>;
    pause(sessionId: string): Promise<void>;
    cancel(sessionId: string): Promise<void>;
    getProgress(sessionId: string): number;
    getSession(sessionId: string): any;
    getActiveSessions(): string[];
    close(): Promise<void>;
}
//# sourceMappingURL=ResumableUploader.d.ts.map