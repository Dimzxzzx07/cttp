export interface IPing {
    ping(url: string, options?: any): Promise<boolean>;
    healthCheck(url: string): Promise<any>;
    getPingCount(): number;
    getUptime(): number;
}
//# sourceMappingURL=IPing.d.ts.map