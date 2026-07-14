"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogger = void 0;
const CTTPClient_1 = require("./CTTPClient");
const CTTPRequest_1 = require("./CTTPRequest");
const HTTPMethod_1 = require("./HTTPMethod");
const BufferUtils_1 = require("../utils/BufferUtils");
const CryptoUtils_1 = require("../utils/CryptoUtils");
const Constants_1 = require("./Constants");
class AuditLogger {
    constructor(config) {
        this.config = config;
        this.constants = new Constants_1.Constants();
        this.bufferUtils = new BufferUtils_1.BufferUtils();
        this.cryptoUtils = new CryptoUtils_1.CryptoUtils();
        this.client = new CTTPClient_1.CTTPClient();
        this.auditCache = new Map();
        this.auditFilters = new Map();
    }
    async audit(url, options) {
        const auditId = this.generateAuditId();
        const request = new CTTPRequest_1.CTTPRequest(HTTPMethod_1.HTTPMethod.AUDIT, url, {
            body: {
                auditId,
                options: options || {},
                timestamp: Date.now()
            }
        });
        const response = await this.client.request(request);
        const data = response.getBody();
        const entries = data.entries || [];
        this.auditCache.set(auditId, entries);
        return {
            auditId,
            entries,
            total: data.total || entries.length,
            timestamp: data.timestamp || Date.now(),
            version: data.version || "1.0"
        };
    }
    generateAuditId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
    async getAuditTrail(resourceId, options) {
        const request = new CTTPRequest_1.CTTPRequest(HTTPMethod_1.HTTPMethod.GET, `/audit/${resourceId}`, {
            body: options || {}
        });
        const response = await this.client.request(request);
        const data = response.getBody();
        return data.entries || [];
    }
    async filterAudit(url, filter) {
        const filterId = this.generateAuditId();
        this.auditFilters.set(filterId, filter);
        const request = new CTTPRequest_1.CTTPRequest(HTTPMethod_1.HTTPMethod.POST, `${url}/filter`, {
            body: {
                filterId,
                filter
            }
        });
        const response = await this.client.request(request);
        const data = response.getBody();
        return data.entries || [];
    }
    async exportAudit(url, format = "json") {
        const request = new CTTPRequest_1.CTTPRequest(HTTPMethod_1.HTTPMethod.GET, `${url}/export`, {
            query: { format }
        });
        const response = await this.client.request(request);
        return response.getBodyAsBuffer();
    }
    getAuditEntries(auditId) {
        return this.auditCache.get(auditId);
    }
    clearCache(auditId) {
        if (auditId) {
            this.auditCache.delete(auditId);
        }
        else {
            this.auditCache.clear();
        }
    }
    getFilter(filterId) {
        return this.auditFilters.get(filterId);
    }
    clearFilters() {
        this.auditFilters.clear();
    }
    async close() {
        await this.client.close();
        this.auditCache.clear();
        this.auditFilters.clear();
    }
}
exports.AuditLogger = AuditLogger;
//# sourceMappingURL=AuditLogger.js.map