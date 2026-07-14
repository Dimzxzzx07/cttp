"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    constructor(level = "info") {
        this.level = level;
        this.levels = new Map([
            ["error", 0],
            ["warn", 1],
            ["info", 2],
            ["debug", 3],
            ["trace", 4]
        ]);
        this.enabled = true;
        this.prefix = "[CTTP]";
    }
    error(message, ...args) {
        this.log("error", message, args);
    }
    warn(message, ...args) {
        this.log("warn", message, args);
    }
    info(message, ...args) {
        this.log("info", message, args);
    }
    debug(message, ...args) {
        this.log("debug", message, args);
    }
    trace(message, ...args) {
        this.log("trace", message, args);
    }
    log(level, message, args) {
        if (!this.enabled)
            return;
        if (!this.shouldLog(level))
            return;
        const timestamp = new Date().toISOString();
        const formatted = `${timestamp} ${this.prefix} [${level.toUpperCase()}] ${message}`;
        const output = args.length > 0 ? `${formatted} ${args.map(a => JSON.stringify(a)).join(" ")}` : formatted;
        if (level === "error") {
            console.error(output);
        }
        else {
            console.log(output);
        }
    }
    shouldLog(level) {
        const currentLevel = this.levels.get(this.level) || 0;
        const messageLevel = this.levels.get(level) || 0;
        return messageLevel <= currentLevel;
    }
    setLevel(level) {
        this.level = level;
    }
    getLevel() {
        return this.level;
    }
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    isEnabled() {
        return this.enabled;
    }
    setPrefix(prefix) {
        this.prefix = prefix;
    }
    getPrefix() {
        return this.prefix;
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map