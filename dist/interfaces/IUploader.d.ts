export interface IUploader {
    upload(url: string, file: string, options?: any): Promise<any>;
    resume(sessionId: string): Promise<void>;
    pause(sessionId: string): Promise<void>;
    cancel(sessionId: string): Promise<void>;
    getProgress(sessionId: string): number;
    getSession(sessionId: string): any;
}
//# sourceMappingURL=IUploader.d.ts.map