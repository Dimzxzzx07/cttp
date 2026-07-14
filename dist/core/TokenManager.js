"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenManager = void 0;
const CTTPClient_1 = require("./CTTPClient");
const CTTPRequest_1 = require("./CTTPRequest");
const HTTPMethod_1 = require("./HTTPMethod");
const BufferUtils_1 = require("../utils/BufferUtils");
const CryptoUtils_1 = require("../utils/CryptoUtils");
const Constants_1 = require("./Constants");
class TokenManager {
    constructor(config) {
        this.config = config;
        this.constants = new Constants_1.Constants();
        this.bufferUtils = new BufferUtils_1.BufferUtils();
        this.cryptoUtils = new CryptoUtils_1.CryptoUtils();
        this.client = new CTTPClient_1.CTTPClient();
        this.tokens = new Map();
        this.refreshTokens = new Map();
        this.tokenTimers = new Map();
    }
    async login(url, credentials) {
        const request = new CTTPRequest_1.CTTPRequest(HTTPMethod_1.HTTPMethod.LOGIN, url, { body: credentials });
        const response = await this.client.request(request);
        const data = response.getBody();
        const token = {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            expiresIn: data.expiresIn || 3600,
            tokenType: data.tokenType || "Bearer",
            issuedAt: Date.now()
        };
        this.tokens.set("current", token);
        this.refreshTokens.set("current", token.refreshToken);
        this.scheduleRefresh(token);
        return token;
    }
    async logout(url, token) {
        const tokenToUse = token || this.getCurrentToken()?.accessToken;
        if (!tokenToUse) {
            return;
        }
        const request = new CTTPRequest_1.CTTPRequest(HTTPMethod_1.HTTPMethod.LOGOUT, url, { body: { token: tokenToUse } });
        await this.client.request(request);
        this.clearTokenTimers();
        this.tokens.delete("current");
        this.refreshTokens.delete("current");
    }
    async refresh(url, refreshToken) {
        const tokenToUse = refreshToken || this.refreshTokens.get("current");
        if (!tokenToUse) {
            throw new Error("No refresh token available");
        }
        const request = new CTTPRequest_1.CTTPRequest(HTTPMethod_1.HTTPMethod.REFRESH, url, { body: { refreshToken: tokenToUse } });
        const response = await this.client.request(request);
        const data = response.getBody();
        const token = {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken || tokenToUse,
            expiresIn: data.expiresIn || 3600,
            tokenType: data.tokenType || "Bearer",
            issuedAt: Date.now()
        };
        this.tokens.set("current", token);
        this.refreshTokens.set("current", token.refreshToken);
        this.scheduleRefresh(token);
        return token;
    }
    scheduleRefresh(token) {
        this.clearTokenTimers();
        const refreshTime = (token.expiresIn * 0.8) * 1000;
        const timer = setTimeout(async () => {
            try {
                const url = this.config.refreshUrl || "/token/refresh";
                await this.refresh(url, token.refreshToken);
            }
            catch (error) {
                this.handleRefreshError(error);
            }
        }, refreshTime);
        this.tokenTimers.set("refresh", timer);
    }
    clearTokenTimers() {
        for (const [key, timer] of this.tokenTimers) {
            clearTimeout(timer);
        }
        this.tokenTimers.clear();
    }
    handleRefreshError(error) {
        this.tokens.delete("current");
        this.refreshTokens.delete("current");
        this.clearTokenTimers();
        this.emit("tokenExpired", error);
    }
    emit(event, data) {
        // Event emission handled by EventEmitter
    }
    getCurrentToken() {
        return this.tokens.get("current");
    }
    getAccessToken() {
        return this.tokens.get("current")?.accessToken;
    }
    getRefreshToken() {
        return this.refreshTokens.get("current");
    }
    isAuthenticated() {
        return this.tokens.has("current");
    }
    isExpired() {
        const token = this.getCurrentToken();
        if (!token) {
            return true;
        }
        const elapsed = (Date.now() - token.issuedAt) / 1000;
        return elapsed >= token.expiresIn;
    }
    async validateToken(url, token) {
        const tokenToUse = token || this.getAccessToken();
        if (!tokenToUse) {
            return false;
        }
        try {
            const request = new CTTPRequest_1.CTTPRequest(HTTPMethod_1.HTTPMethod.GET, `${url}/validate`, {
                headers: {
                    Authorization: `Bearer ${tokenToUse}`
                }
            });
            const response = await this.client.request(request);
            return response.getStatus() === 200;
        }
        catch {
            return false;
        }
    }
    async close() {
        this.clearTokenTimers();
        await this.client.close();
        this.tokens.clear();
        this.refreshTokens.clear();
    }
}
exports.TokenManager = TokenManager;
//# sourceMappingURL=TokenManager.js.map