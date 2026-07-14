"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomMethodRegistry = void 0;
class CustomMethodRegistry {
    constructor(config) {
        this.handlers = new Map();
        this.config = config || { allowOverride: false, strictMode: true };
    }
    register(method, handler) {
        if (this.handlers.has(method) && !this.config.allowOverride) {
            throw new Error(`Method ${method} already registered`);
        }
        this.handlers.set(method, handler);
    }
    unregister(method) {
        this.handlers.delete(method);
    }
    getHandler(method) {
        return this.handlers.get(method);
    }
    hasHandler(method) {
        return this.handlers.has(method);
    }
    getRegisteredMethods() {
        return Array.from(this.handlers.keys());
    }
    clear() {
        this.handlers.clear();
    }
    setConfig(config) {
        this.config = { ...this.config, ...config };
    }
    getConfig() {
        return { ...this.config };
    }
}
exports.CustomMethodRegistry = CustomMethodRegistry;
//# sourceMappingURL=CustomMethodRegistry.js.map