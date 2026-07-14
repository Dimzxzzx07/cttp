"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DenoAdapter = void 0;
class DenoAdapter {
    constructor() {
        this.deno = typeof Deno !== "undefined" ? Deno : null;
    }
    getDeno() {
        return this.deno;
    }
    async readFile(path) {
        if (!this.deno) {
            throw new Error("Deno not available");
        }
        return this.deno.readFile(path);
    }
    async writeFile(path, data) {
        if (!this.deno) {
            throw new Error("Deno not available");
        }
        return this.deno.writeFile(path, data);
    }
    async connect(host, port) {
        if (!this.deno) {
            throw new Error("Deno not available");
        }
        return this.deno.connect({ hostname: host, port });
    }
    async listen(host, port) {
        if (!this.deno) {
            throw new Error("Deno not available");
        }
        return this.deno.listen({ hostname: host, port });
    }
    async resolve(host) {
        if (!this.deno) {
            throw new Error("Deno not available");
        }
        return this.deno.resolveDns(host);
    }
    getVersion() {
        if (!this.deno) {
            return "unknown";
        }
        return this.deno.version.deno;
    }
    getArgs() {
        if (!this.deno) {
            return [];
        }
        return this.deno.args;
    }
    getEnv(key) {
        if (!this.deno) {
            return undefined;
        }
        return this.deno.env.get(key);
    }
    isAvailable() {
        return this.deno !== null;
    }
}
exports.DenoAdapter = DenoAdapter;
//# sourceMappingURL=DenoAdapter.js.map