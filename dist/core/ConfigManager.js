"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManager = void 0;
class ConfigManager {
    constructor(config) {
        this.defaults = this.getDefaultConfig();
        this.config = this.mergeConfig(this.defaults, config || {});
    }
    getDefaultConfig() {
        return {
            defaultTimeout: 30000,
            defaultVersion: "HTTP/1.1",
            enableTunnel: false,
            logLevel: "info",
            poolConfig: {
                maxConnections: 100,
                idleTimeout: 60000,
                connectionTimeout: 30000
            }
        };
    }
    mergeConfig(defaults, custom) {
        const merged = { ...defaults };
        for (const key of Object.keys(custom)) {
            const value = custom[key];
            if (value !== undefined && value !== null) {
                if (typeof value === "object" && !Buffer.isBuffer(value)) {
                    merged[key] = { ...(merged[key] || {}), ...value };
                }
                else {
                    merged[key] = value;
                }
            }
        }
        return merged;
    }
    getConfig() {
        return { ...this.config };
    }
    update(config) {
        this.config = this.mergeConfig(this.config, config);
    }
    reset() {
        this.config = { ...this.defaults };
    }
    get(key) {
        return this.config[key];
    }
    set(key, value) {
        if (typeof value === "object" && !Buffer.isBuffer(value)) {
            this.config[key] = { ...(this.config[key] || {}), ...value };
        }
        else {
            this.config[key] = value;
        }
    }
}
exports.ConfigManager = ConfigManager;
//# sourceMappingURL=ConfigManager.js.map