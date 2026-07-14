"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeEngine = void 0;
const CTTPClient_1 = require("./CTTPClient");
const CTTPRequest_1 = require("./CTTPRequest");
const HTTPMethod_1 = require("./HTTPMethod");
const BufferUtils_1 = require("../utils/BufferUtils");
const CryptoUtils_1 = require("../utils/CryptoUtils");
const Constants_1 = require("./Constants");
class MergeEngine {
    constructor(config) {
        this.config = config;
        this.constants = new Constants_1.Constants();
        this.bufferUtils = new BufferUtils_1.BufferUtils();
        this.cryptoUtils = new CryptoUtils_1.CryptoUtils();
        this.client = new CTTPClient_1.CTTPClient();
        this.mergeSessions = new Map();
        this.conflictResolutions = new Map();
    }
    async merge(url, conflicts, options) {
        const mergeId = this.generateMergeId();
        const session = {
            id: mergeId,
            url,
            conflicts: conflicts,
            resolved: [],
            status: "initiated",
            timestamp: Date.now(),
            strategy: options?.strategy || this.config.defaultStrategy
        };
        this.mergeSessions.set(mergeId, session);
        try {
            const request = new CTTPRequest_1.CTTPRequest(HTTPMethod_1.HTTPMethod.MERGE, url, {
                body: {
                    mergeId,
                    conflicts,
                    options: options || {}
                }
            });
            const response = await this.client.request(request);
            const data = response.getBody();
            session.status = "completed";
            return {
                mergeId,
                resolved: data.resolved || [],
                conflicts: data.conflicts || [],
                status: data.status || "success",
                timestamp: data.timestamp || Date.now()
            };
        }
        catch (error) {
            session.status = "failed";
            throw error;
        }
    }
    generateMergeId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
    async resolveConflict(url, mergeId, conflictId, resolution) {
        const session = this.mergeSessions.get(mergeId);
        if (!session) {
            throw new Error(`Merge session ${mergeId} not found`);
        }
        const request = new CTTPRequest_1.CTTPRequest(HTTPMethod_1.HTTPMethod.POST, `${url}/resolve`, {
            body: {
                mergeId,
                conflictId,
                resolution
            }
        });
        await this.client.request(request);
        session.resolved.push(conflictId);
        this.conflictResolutions.set(conflictId, resolution);
    }
    async rollback(mergeId) {
        const session = this.mergeSessions.get(mergeId);
        if (!session) {
            throw new Error(`Merge session ${mergeId} not found`);
        }
        const request = new CTTPRequest_1.CTTPRequest(HTTPMethod_1.HTTPMethod.POST, `${session.url}/rollback`, {
            body: { mergeId }
        });
        await this.client.request(request);
        session.status = "rolledback";
    }
    getMergeSession(mergeId) {
        return this.mergeSessions.get(mergeId);
    }
    getMergeSessions() {
        return Array.from(this.mergeSessions.values());
    }
    getResolution(conflictId) {
        return this.conflictResolutions.get(conflictId);
    }
    clearMergeSession(mergeId) {
        this.mergeSessions.delete(mergeId);
    }
    clearAllSessions() {
        this.mergeSessions.clear();
        this.conflictResolutions.clear();
    }
    async close() {
        await this.client.close();
        this.mergeSessions.clear();
        this.conflictResolutions.clear();
    }
}
exports.MergeEngine = MergeEngine;
//# sourceMappingURL=MergeEngine.js.map