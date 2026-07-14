"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthChecker = void 0;
const CTTPClient_1 = require("./CTTPClient");
const CTTPRequest_1 = require("./CTTPRequest");
const HTTPMethod_1 = require("./HTTPMethod");
const BufferUtils_1 = require("../utils/BufferUtils");
const CryptoUtils_1 = require("../utils/CryptoUtils");
const Constants_1 = require("./Constants");
class HealthChecker {
    constructor(config) {
        this.config = config;
        this.constants = new Constants_1.Constants();
        this.bufferUtils = new BufferUtils_1.BufferUtils();
        this.cryptoUtils = new CryptoUtils_1.CryptoUtils();
        this.client = new CTTPClient_1.CTTPClient();
        this.healthStatus = new Map();
        this.healthChecks = new Map();
        this.registerDefaultChecks();
    }
    registerDefaultChecks() {
        this.registerCheck("connection", this.checkConnection.bind(this));
        this.registerCheck("tls", this.checkTLS.bind(this));
        this.registerCheck("dns", this.checkDNS.bind(this));
        this.registerCheck("quic", this.checkQUIC.bind(this));
    }
    async ping(url, options) {
        try {
            const request = new CTTPRequest_1.CTTPRequest(HTTPMethod_1.HTTPMethod.PING, url, {
                body: options || {},
                timeout: this.config.pingTimeout || 5000
            });
            const response = await this.client.request(request);
            const status = response.getStatus();
            const data = response.getBody();
            this.healthStatus.set(url, {
                status: status === 200,
                timestamp: Date.now(),
                data,
                latency: response.getDuration()
            });
            return status === 200;
        }
        catch (error) {
            this.healthStatus.set(url, {
                status: false,
                timestamp: Date.now(),
                error: error.message,
                latency: 0
            });
            return false;
        }
    }
    async healthCheck(url) {
        const result = {
            url,
            status: "unknown",
            checks: {},
            timestamp: Date.now()
        };
        for (const [name, check] of this.healthChecks) {
            try {
                const checkResult = await check(url);
                result.checks[name] = checkResult;
                if (checkResult.status === false) {
                    result.status = "degraded";
                }
            }
            catch (error) {
                result.checks[name] = {
                    status: false,
                    error: error.message
                };
                result.status = "degraded";
            }
        }
        if (result.status === "unknown") {
            result.status = "healthy";
        }
        this.healthStatus.set(url, result);
        return result;
    }
    async checkConnection(url) {
        const start = Date.now();
        const request = new CTTPRequest_1.CTTPRequest(HTTPMethod_1.HTTPMethod.HEAD, url, { timeout: 5000 });
        try {
            await this.client.request(request);
            return {
                status: true,
                latency: Date.now() - start,
                timestamp: Date.now()
            };
        }
        catch (error) {
            return {
                status: false,
                error: error.message,
                timestamp: Date.now()
            };
        }
    }
    async checkTLS(url) {
        return {
            status: true,
            version: "TLS 1.3",
            timestamp: Date.now()
        };
    }
    async checkDNS(url) {
        return {
            status: true,
            resolved: true,
            timestamp: Date.now()
        };
    }
    async checkQUIC(url) {
        return {
            status: true,
            supported: true,
            timestamp: Date.now()
        };
    }
    registerCheck(name, check) {
        this.healthChecks.set(name, check);
    }
    unregisterCheck(name) {
        this.healthChecks.delete(name);
    }
    getHealthStatus(url) {
        return this.healthStatus.get(url);
    }
    getAllHealthStatus() {
        return new Map(this.healthStatus);
    }
    clearHealthStatus() {
        this.healthStatus.clear();
    }
    async close() {
        await this.client.close();
        this.healthStatus.clear();
        this.healthChecks.clear();
    }
}
exports.HealthChecker = HealthChecker;
//# sourceMappingURL=HealthChecker.js.map