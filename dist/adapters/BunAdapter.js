"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BunAdapter = void 0;
class BunAdapter {
    constructor() {
        this.bun = typeof Bun !== "undefined" ? Bun : null;
    }
    getBun() {
        return this.bun;
    }
    async readFile(path) {
        if (!this.bun) {
            throw new Error("Bun not available");
        }
        return this.bun.file(path).arrayBuffer();
    }
    async writeFile(path, data) {
        if (!this.bun) {
            throw new Error("Bun not available");
        }
        await this.bun.write(path, data);
    }
    async connect(host, port) {
        if (!this.bun) {
            throw new Error("Bun not available");
        }
        return this.bun.connect({ hostname: host, port });
    }
    async listen(host, port) {
        if (!this.bun) {
            throw new Error("Bun not available");
        }
        return this.bun.listen({ hostname: host, port });
    }
    getVersion() {
        if (!this.bun) {
            return "unknown";
        }
        return this.bun.version;
    }
    getEnv(key) {
        if (!this.bun) {
            return undefined;
        }
        return this.bun.env[key];
    }
    isAvailable() {
        return this.bun !== null;
    }
}
exports.BunAdapter = BunAdapter;
//# sourceMappingURL=BunAdapter.js.map