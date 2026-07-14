"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerPushManager = void 0;
class ServerPushManager {
    constructor() {
        this.pushPromises = new Map();
        this.pushCache = new Map();
        this.enabled = true;
        this.maxConcurrentPushes = 10;
        this.activePushes = 0;
    }
    async push(streamId, url, headers) {
        if (!this.enabled) {
            return;
        }
        const pushId = this.generatePushId(streamId, url);
        if (this.pushPromises.has(pushId)) {
            return;
        }
        if (this.activePushes >= this.maxConcurrentPushes) {
            await this.waitForPushSlot();
        }
        this.activePushes++;
        const promise = this.executePush(streamId, url, headers);
        this.pushPromises.set(pushId, promise);
        try {
            await promise;
        }
        finally {
            this.activePushes--;
            this.pushPromises.delete(pushId);
        }
    }
    async executePush(streamId, url, headers) {
        const cached = this.pushCache.get(url);
        if (cached) {
            return;
        }
        const response = await this.fetchResource(url, headers);
        this.pushCache.set(url, response);
        if (this.pushCache.size > 100) {
            const firstKey = this.pushCache.keys().next().value;
            if (firstKey) {
                this.pushCache.delete(firstKey);
            }
        }
    }
    async fetchResource(url, headers) {
        return {
            url,
            headers,
            status: 200,
            body: Buffer.from("pushed content"),
            timestamp: Date.now()
        };
    }
    async waitForPushSlot() {
        return new Promise((resolve) => {
            const check = setInterval(() => {
                if (this.activePushes < this.maxConcurrentPushes) {
                    clearInterval(check);
                    resolve();
                }
            }, 10);
        });
    }
    generatePushId(streamId, url) {
        return `${streamId}:${url}`;
    }
    enable() {
        this.enabled = true;
    }
    disable() {
        this.enabled = false;
    }
    isEnabled() {
        return this.enabled;
    }
    setMaxConcurrentPushes(max) {
        this.maxConcurrentPushes = Math.max(1, max);
    }
    getMaxConcurrentPushes() {
        return this.maxConcurrentPushes;
    }
    getActivePushes() {
        return this.activePushes;
    }
    getCacheSize() {
        return this.pushCache.size;
    }
    clearCache() {
        this.pushCache.clear();
    }
    getPushPromises() {
        return this.pushPromises.size;
    }
}
exports.ServerPushManager = ServerPushManager;
//# sourceMappingURL=ServerPushManager.js.map