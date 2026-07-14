"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPTunnel = void 0;
const CTTPRequest_1 = require("./CTTPRequest");
const CTTPResponse_1 = require("./CTTPResponse");
const HTTPMethod_1 = require("./HTTPMethod");
const HTTPVersion_1 = require("./HTTPVersion");
const ConnectionPool_1 = require("./ConnectionPool");
const TLSSession_1 = require("./TLSSession");
const BufferUtils_1 = require("../utils/BufferUtils");
const CryptoUtils_1 = require("../utils/CryptoUtils");
const Constants_1 = require("./Constants");
class HTTPTunnel {
    constructor(config) {
        this.config = config;
        this.constants = new Constants_1.Constants();
        this.bufferUtils = new BufferUtils_1.BufferUtils();
        this.cryptoUtils = new CryptoUtils_1.CryptoUtils();
        this.sessions = new Map();
        this.activeTunnels = new Map();
        this.connectionPool = new ConnectionPool_1.ConnectionPool(config.poolConfig);
        this.tlsSession = new TLSSession_1.TLSSession(config.tlsConfig);
    }
    async send(request) {
        const tunnelId = this.generateTunnelId();
        const connection = await this.connectionPool.acquire(request.getURL());
        const tunnelRequest = this.createTunnelRequest(request, tunnelId);
        const rawBuffer = tunnelRequest.toBuffer();
        const encryptedBuffer = await this.encryptPayload(rawBuffer);
        const tunnelFrame = this.buildTunnelFrame(encryptedBuffer, tunnelId);
        await connection.write(tunnelFrame);
        const responseBuffer = await connection.read();
        const decryptedBuffer = await this.decryptPayload(responseBuffer);
        const response = this.parseTunnelResponse(decryptedBuffer);
        this.connectionPool.release(connection);
        this.activeTunnels.delete(tunnelId);
        return response;
    }
    generateTunnelId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
    createTunnelRequest(request, tunnelId) {
        const tunnelRequest = new CTTPRequest_1.CTTPRequest(HTTPMethod_1.HTTPMethod.POST, "/tunnel", {
            headers: {
                "X-Tunnel-ID": tunnelId,
                "X-Tunnel-Method": request.getMethod(),
                "X-Tunnel-URL": request.getURL(),
                "X-Tunnel-Version": request.getVersion(),
                "Content-Type": "application/octet-stream"
            },
            body: request.toBuffer().toString("base64"),
            tunnel: false,
            version: HTTPVersion_1.HTTPVersion.HTTP_1_1
        });
        return tunnelRequest;
    }
    buildTunnelFrame(payload, tunnelId) {
        const header = Buffer.alloc(20);
        header.writeUInt32BE(this.constants.TUNNEL_MAGIC, 0);
        header.writeUInt16BE(this.constants.TUNNEL_VERSION, 4);
        header.writeUInt32BE(payload.length, 6);
        header.write(tunnelId, 10, 10, "ascii");
        return Buffer.concat([header, payload]);
    }
    parseTunnelResponse(buffer) {
        const header = buffer.subarray(0, 20);
        const magic = header.readUInt32BE(0);
        const version = header.readUInt16BE(4);
        const length = header.readUInt32BE(6);
        const tunnelId = header.subarray(10, 20).toString("ascii");
        const payload = buffer.subarray(20, 20 + length);
        const responseData = JSON.parse(payload.toString());
        const headers = new Map();
        for (const [key, value] of Object.entries(responseData.headers)) {
            headers.set(key, value);
        }
        const response = new CTTPResponse_1.CTTPResponse(responseData.status, responseData.statusText, responseData.version, headers, responseData.body);
        return response;
    }
    async encryptPayload(payload) {
        if (!this.config.encrypt) {
            return payload;
        }
        const key = Buffer.from(this.config.encryptionKey, "hex");
        const iv = this.cryptoUtils.generateIV();
        const encrypted = this.cryptoUtils.encryptAESGCM(payload, key, iv);
        return Buffer.concat([iv, encrypted]);
    }
    async decryptPayload(payload) {
        if (!this.config.encrypt) {
            return payload;
        }
        const key = Buffer.from(this.config.encryptionKey, "hex");
        const iv = payload.subarray(0, 12);
        const encrypted = payload.subarray(12);
        return this.cryptoUtils.decryptAESGCM(encrypted, key, iv);
    }
    async close() {
        await this.connectionPool.close();
        await this.tlsSession.close();
        this.sessions.clear();
        this.activeTunnels.clear();
    }
    async healthCheck() {
        try {
            const testId = this.generateTunnelId();
            const testPayload = Buffer.from("ping");
            const frame = this.buildTunnelFrame(testPayload, testId);
            return true;
        }
        catch {
            return false;
        }
    }
    getActiveTunnels() {
        return this.activeTunnels.size;
    }
    getSession(tunnelId) {
        return this.sessions.get(tunnelId);
    }
    removeSession(tunnelId) {
        this.sessions.delete(tunnelId);
        this.activeTunnels.delete(tunnelId);
    }
}
exports.HTTPTunnel = HTTPTunnel;
//# sourceMappingURL=HTTPTunnel.js.map