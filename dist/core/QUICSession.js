"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QUICSession = void 0;
const Constants_1 = require("./Constants");
const BufferUtils_1 = require("../utils/BufferUtils");
const CryptoUtils_1 = require("../utils/CryptoUtils");
class QUICSession {
    constructor(config) {
        this.config = config;
        this.constants = new Constants_1.Constants();
        this.bufferUtils = new BufferUtils_1.BufferUtils();
        this.cryptoUtils = new CryptoUtils_1.CryptoUtils();
        this.sessions = new Map();
        this.streams = new Map();
    }
    async createSession(hostname, port) {
        const quic = require("quic");
        const key = `${hostname}:${port}`;
        if (this.sessions.has(key)) {
            return this.sessions.get(key);
        }
        const session = quic.connect({
            host: hostname,
            port: port,
            alpn: this.config.alpn || ["h3"],
            maxIncomingStreams: this.config.maxStreams || 100
        });
        this.sessions.set(key, session);
        return session;
    }
    async createStream(session) {
        const stream = session.createStream({
            type: "bidirectional",
            priority: 0
        });
        const id = this.generateStreamId();
        this.streams.set(id, stream);
        return stream;
    }
    generateStreamId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
    async sendData(stream, data) {
        return new Promise((resolve, reject) => {
            stream.write(data, (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    async receiveData(stream) {
        return new Promise((resolve, reject) => {
            stream.once("data", (data) => resolve(data));
            stream.once("error", reject);
            stream.once("end", () => reject(new Error("Stream ended")));
        });
    }
    async close() {
        for (const [key, session] of this.sessions) {
            session.close();
        }
        this.sessions.clear();
        this.streams.clear();
    }
}
exports.QUICSession = QUICSession;
//# sourceMappingURL=QUICSession.js.map