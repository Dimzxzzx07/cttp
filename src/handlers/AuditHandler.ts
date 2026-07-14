import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
import { CTTPResponse } from "../core/CTTPResponse";
import { HTTPVersion } from "../core/HTTPVersion";

export class AuditHandler implements IMethodHandler {
  private auditLogs: Map<string, any[]>;
  private maxEntries: number;

  constructor() {
    this.auditLogs = new Map();
    this.maxEntries = 1000;
  }

  public async handle(request: IHTTPRequest): Promise<IHTTPResponse> {
    const body = request.getBody();
    const resourceId = body?.resourceId || this.extractResourceId(request.getURL());
    const startTime = body?.startTime;
    const endTime = body?.endTime;
    const limit = body?.limit || 100;
    const filter = body?.filter || {};

    if (!resourceId) {
      return new CTTPResponse(
        400,
        "Bad Request",
        HTTPVersion.HTTP_1_1,
        new Map([["Content-Type", "application/json"]]),
        { error: "Missing resourceId" }
      );
    }

    let logs = this.auditLogs.get(resourceId) || [];
    logs = this.filterLogs(logs, startTime, endTime, filter);
    logs = logs.slice(0, Math.min(limit, logs.length));

    const total = this.auditLogs.get(resourceId)?.length || 0;

    return new CTTPResponse(
      200,
      "OK",
      HTTPVersion.HTTP_1_1,
      new Map([["Content-Type", "application/json"]]),
      {
        auditId: this.generateAuditId(),
        entries: logs,
        total,
        timestamp: Date.now(),
        version: "1.0"
      }
    );
  }

  private extractResourceId(url: string): string {
    const parts = url.split("/");
    return parts[parts.length - 1] || url;
  }

  private generateAuditId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  private filterLogs(
    logs: any[],
    startTime?: string,
    endTime?: string,
    filter?: any
  ): any[] {
    let filtered = [...logs];

    if (startTime) {
      const start = new Date(startTime).getTime();
      filtered = filtered.filter(log => log.timestamp >= start);
    }

    if (endTime) {
      const end = new Date(endTime).getTime();
      filtered = filtered.filter(log => log.timestamp <= end);
    }

    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        filtered = filtered.filter(log => {
          if (key in log) {
            return log[key] === value;
          }
          return true;
        });
      }
    }

    return filtered;
  }

  public log(resourceId: string, action: string, details: any): void {
    if (!this.auditLogs.has(resourceId)) {
      this.auditLogs.set(resourceId, []);
    }

    const logs = this.auditLogs.get(resourceId)!;
    logs.push({
      id: this.generateAuditId(),
      resourceId,
      action,
      details,
      timestamp: Date.now(),
      ip: "127.0.0.1",
      userAgent: "CTTP/1.0"
    });

    if (logs.length > this.maxEntries) {
      logs.splice(0, logs.length - this.maxEntries);
    }
  }

  public getLogs(resourceId: string): any[] {
    return this.auditLogs.get(resourceId) || [];
  }

  public getResourceIds(): string[] {
    return Array.from(this.auditLogs.keys());
  }

  public clearLogs(resourceId?: string): void {
    if (resourceId) {
      this.auditLogs.delete(resourceId);
    } else {
      this.auditLogs.clear();
    }
  }

  public setMaxEntries(max: number): void {
    this.maxEntries = Math.max(1, max);
  }

  public getMaxEntries(): number {
    return this.maxEntries;
  }

  public exportLogs(resourceId: string, format: string = "json"): Buffer {
    const logs = this.auditLogs.get(resourceId) || [];
    if (format === "csv") {
      const headers = ["id", "resourceId", "action", "timestamp", "ip", "userAgent"];
      let csv = headers.join(",") + "\n";
      for (const log of logs) {
        const values = headers.map(h => {
          const value = log[h] || "";
          return typeof value === "string" ? `"${value}"` : value;
        });
        csv += values.join(",") + "\n";
      }
      return Buffer.from(csv, "utf8");
    }
    return Buffer.from(JSON.stringify(logs), "utf8");
  }
}