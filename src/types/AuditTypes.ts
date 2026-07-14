export namespace AuditTypes {
  export interface AuditOptions {
    resourceId?: string;
    startTime?: string;
    endTime?: string;
    limit?: number;
    filter?: any;
    sort?: "asc" | "desc";
  }

  export interface AuditEntry {
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

  export interface AuditResponse {
    auditId: string;
    entries: AuditEntry[];
    total: number;
    timestamp: number;
    version: string;
  }
}