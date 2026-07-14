"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingHandler = void 0;
const CTTPResponse_1 = require("../core/CTTPResponse");
const HTTPVersion_1 = require("../core/HTTPVersion");
class PingHandler {
    constructor() {
        this.startTime = Date.now();
        this.pingCount = 0;
    }
    async handle(request) {
        this.pingCount++;
        const body = request.getBody();
        const responseBody = {
            status: "ok",
            timestamp: Date.now(),
            uptime: Date.now() - this.startTime,
            pingId: this.generatePingId(),
            count: this.pingCount,
            data: body?.data || null
        };
        return new CTTPResponse_1.CTTPResponse(200, "OK", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([
            ["Content-Type", "application/json"],
            ["X-Ping-Count", String(this.pingCount)],
            ["X-Ping-Time", String(Date.now())]
        ]), responseBody);
    }
    generatePingId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    }
    getPingCount() {
        return this.pingCount;
    }
    getUptime() {
        return Date.now() - this.startTime;
    }
    reset() {
        this.pingCount = 0;
        this.startTime = Date.now();
    }
}
exports.PingHandler = PingHandler;
//# sourceMappingURL=PingHandler.js.map