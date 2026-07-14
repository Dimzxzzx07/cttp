/// <reference types="node" />
/// <reference types="node" />
export interface IAudit {
    audit(url: string, options?: any): Promise<any>;
    getAuditTrail(resourceId: string, options?: any): Promise<any[]>;
    filterAudit(url: string, filter: any): Promise<any[]>;
    exportAudit(url: string, format?: string): Promise<Buffer>;
}
//# sourceMappingURL=IAudit.d.ts.map