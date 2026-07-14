/// <reference types="node" />
/// <reference types="node" />
import { ConfigTypes } from "../types/ConfigTypes";
import { AuditTypes } from "../types/AuditTypes";
export declare class AuditLogger {
    private client;
    private bufferUtils;
    private cryptoUtils;
    private constants;
    private config;
    private auditCache;
    private auditFilters;
    constructor(config: ConfigTypes.AuditConfig);
    audit(url: string, options?: AuditTypes.AuditOptions): Promise<AuditTypes.AuditResponse>;
    private generateAuditId;
    getAuditTrail(resourceId: string, options?: AuditTypes.AuditOptions): Promise<AuditTypes.AuditEntry[]>;
    filterAudit(url: string, filter: any): Promise<AuditTypes.AuditEntry[]>;
    exportAudit(url: string, format?: string): Promise<Buffer>;
    getAuditEntries(auditId: string): AuditTypes.AuditEntry[] | undefined;
    clearCache(auditId?: string): void;
    getFilter(filterId: string): any;
    clearFilters(): void;
    close(): Promise<void>;
}
//# sourceMappingURL=AuditLogger.d.ts.map