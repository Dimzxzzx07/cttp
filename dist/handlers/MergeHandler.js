"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeHandler = void 0;
const CTTPResponse_1 = require("../core/CTTPResponse");
const HTTPVersion_1 = require("../core/HTTPVersion");
class MergeHandler {
    constructor() {
        this.mergeSessions = new Map();
    }
    async handle(request) {
        const body = request.getBody();
        const conflicts = body?.conflicts || [];
        const mergeId = body?.mergeId || this.generateMergeId();
        const strategy = body?.strategy || "union";
        if (conflicts.length === 0) {
            return new CTTPResponse_1.CTTPResponse(400, "Bad Request", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), { error: "No conflicts to merge" });
        }
        const resolved = this.resolveConflicts(conflicts, strategy);
        const remainingConflicts = this.getRemainingConflicts(conflicts, resolved);
        this.mergeSessions.set(mergeId, {
            conflicts,
            resolved,
            strategy,
            status: "completed",
            timestamp: Date.now()
        });
        return new CTTPResponse_1.CTTPResponse(200, "OK", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), {
            mergeId,
            resolved,
            conflicts: remainingConflicts,
            status: remainingConflicts.length === 0 ? "success" : "partial",
            timestamp: Date.now()
        });
    }
    generateMergeId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
    resolveConflicts(conflicts, strategy) {
        const resolved = [];
        for (const conflict of conflicts) {
            const resolution = this.resolveConflict(conflict, strategy);
            if (resolution) {
                resolved.push(resolution);
            }
        }
        return resolved;
    }
    resolveConflict(conflict, strategy) {
        switch (strategy) {
            case "union":
                return {
                    ...conflict.existing,
                    ...conflict.incoming
                };
            case "intersection":
                return this.intersectObjects(conflict.existing, conflict.incoming);
            case "difference":
                return this.differenceObjects(conflict.existing, conflict.incoming);
            case "existing":
                return conflict.existing;
            case "incoming":
                return conflict.incoming;
            default:
                return null;
        }
    }
    intersectObjects(obj1, obj2) {
        const result = {};
        for (const key of Object.keys(obj1)) {
            if (obj2.hasOwnProperty(key)) {
                result[key] = obj1[key];
            }
        }
        return result;
    }
    differenceObjects(obj1, obj2) {
        const result = {};
        for (const key of Object.keys(obj1)) {
            if (!obj2.hasOwnProperty(key)) {
                result[key] = obj1[key];
            }
        }
        return result;
    }
    getRemainingConflicts(conflicts, resolved) {
        const resolvedIds = new Set(resolved.map(r => r.id || r.resource));
        return conflicts.filter(c => !resolvedIds.has(c.id || c.resource));
    }
}
exports.MergeHandler = MergeHandler;
//# sourceMappingURL=MergeHandler.js.map