/// <reference types="node" />
/// <reference types="node" />
import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
export declare class AuditHandler implements IMethodHandler {
    private auditLogs;
    private maxEntries;
    constructor();
    handle(request: IHTTPRequest): Promise<IHTTPResponse>;
    private extractResourceId;
    private generateAuditId;
    private filterLogs;
    log(resourceId: string, action: string, details: any): void;
    getLogs(resourceId: string): any[];
    getResourceIds(): string[];
    clearLogs(resourceId?: string): void;
    setMaxEntries(max: number): void;
    getMaxEntries(): number;
    exportLogs(resourceId: string, format?: string): Buffer;
}
//# sourceMappingURL=AuditHandler.d.ts.map