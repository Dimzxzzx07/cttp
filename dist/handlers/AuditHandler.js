"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditHandler = void 0;
const CTTPResponse_1 = require("../core/CTTPResponse");
const HTTPVersion_1 = require("../core/HTTPVersion");
class AuditHandler {
    constructor() {
        this.auditLogs = new Map();
        this.maxEntries = 1000;
    }
    async handle(request) {
        const body = request.getBody();
        const resourceId = body?.resourceId || this.extractResourceId(request.getURL());
        const startTime = body?.startTime;
        const endTime = body?.endTime;
        const limit = body?.limit || 100;
        const filter = body?.filter || {};
        if (!resourceId) {
            return new CTTPResponse_1.CTTPResponse(400, "Bad Request", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), { error: "Missing resourceId" });
        }
        let logs = this.auditLogs.get(resourceId) || [];
        logs = this.filterLogs(logs, startTime, endTime, filter);
        logs = logs.slice(0, Math.min(limit, logs.length));
        const total = this.auditLogs.get(resourceId)?.length || 0;
        return new CTTPResponse_1.CTTPResponse(200, "OK", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), {
            auditId: this.generateAuditId(),
            entries: logs,
            total,
            timestamp: Date.now(),
            version: "1.0"
        });
    }
    extractResourceId(url) {
        const parts = url.split("/");
        return parts[parts.length - 1] || url;
    }
    generateAuditId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
    filterLogs(logs, startTime, endTime, filter) {
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
    log(resourceId, action, details) {
        if (!this.auditLogs.has(resourceId)) {
            this.auditLogs.set(resourceId, []);
        }
        const logs = this.auditLogs.get(resourceId);
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
    getLogs(resourceId) {
        return this.auditLogs.get(resourceId) || [];
    }
    getResourceIds() {
        return Array.from(this.auditLogs.keys());
    }
    clearLogs(resourceId) {
        if (resourceId) {
            this.auditLogs.delete(resourceId);
        }
        else {
            this.auditLogs.clear();
        }
    }
    setMaxEntries(max) {
        this.maxEntries = Math.max(1, max);
    }
    getMaxEntries() {
        return this.maxEntries;
    }
    exportLogs(resourceId, format = "json") {
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
exports.AuditHandler = AuditHandler;
//# sourceMappingURL=AuditHandler.js.map