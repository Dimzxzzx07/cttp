"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncHandler = void 0;
const CTTPResponse_1 = require("../core/CTTPResponse");
const HTTPVersion_1 = require("../core/HTTPVersion");
class SyncHandler {
    constructor() {
        this.syncStates = new Map();
    }
    async handle(request) {
        const body = request.getBody();
        const lastSync = body?.lastSync;
        const syncId = body?.syncId || this.generateSyncId();
        if (!lastSync) {
            return new CTTPResponse_1.CTTPResponse(400, "Bad Request", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), { error: "Missing lastSync timestamp" });
        }
        const changes = this.getChanges(lastSync);
        const conflicts = this.detectConflicts(changes);
        const timestamp = Date.now();
        this.syncStates.set(syncId, {
            lastSync,
            currentSync: timestamp,
            changes,
            conflicts,
            status: "success"
        });
        return new CTTPResponse_1.CTTPResponse(200, "OK", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), {
            syncId,
            timestamp,
            changes,
            conflicts,
            version: "1.0",
            total: changes.length
        });
    }
    generateSyncId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
    getChanges(lastSync) {
        const lastSyncTime = new Date(lastSync).getTime();
        const changes = [];
        for (let i = 0; i < 10; i++) {
            const timestamp = lastSyncTime + i * 1000;
            if (timestamp > Date.now())
                break;
            changes.push({
                id: `change-${i}`,
                type: i % 3 === 0 ? "update" : i % 3 === 1 ? "create" : "delete",
                timestamp: new Date(timestamp).toISOString(),
                data: { value: i }
            });
        }
        return changes;
    }
    detectConflicts(changes) {
        const conflicts = [];
        const resourceMap = new Map();
        for (const change of changes) {
            const key = change.id;
            if (resourceMap.has(key)) {
                conflicts.push({
                    resource: key,
                    existing: resourceMap.get(key),
                    incoming: change,
                    resolution: "pending"
                });
            }
            resourceMap.set(key, change);
        }
        return conflicts;
    }
}
exports.SyncHandler = SyncHandler;
//# sourceMappingURL=SyncHandler.js.map