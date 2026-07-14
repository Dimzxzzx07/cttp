export declare namespace AuditTypes {
    interface AuditOptions {
        resourceId?: string;
        startTime?: string;
        endTime?: string;
        limit?: number;
        filter?: any;
        sort?: "asc" | "desc";
    }
    interface AuditEntry {
        id: string;
        resourceId: string;
        action: string;
        details: any;
        timestamp: number;
        ip: string;
        userAgent: string;
        userId?: string;
        sessionId?: string;
    }
    interface AuditResponse {
        auditId: string;
        entries: AuditEntry[];
        total: number;
        timestamp: number;
        version: string;
    }
}
//# sourceMappingURL=AuditTypes.d.ts.map