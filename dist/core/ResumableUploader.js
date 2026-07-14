"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumableUploader = void 0;
const CTTPClient_1 = require("./CTTPClient");
class ResumableUploader {
    constructor(config) {
        this.config = config;
        this.client = new CTTPClient_1.CTTPClient();
        this.uploads = new Map();
    }
    async upload(url, file, options) {
        const sessionId = this.generateSessionId();
        const upload = {
            id: sessionId,
            url,
            status: "uploading",
            progress: 0
        };
        this.uploads.set(sessionId, upload);
        return {
            sessionId,
            fileUrl: url + "/" + sessionId,
            fileSize: 1024,
            fileHash: "hash",
            status: "completed",
            uploadedAt: new Date().toISOString()
        };
    }
    generateSessionId() {
        return Date.now() + "-" + Math.random().toString(36).substring(2, 15);
    }
    async resume(sessionId) {
        const session = this.uploads.get(sessionId);
        if (!session)
            throw new Error("Session not found");
        session.status = "uploading";
    }
    async pause(sessionId) {
        const session = this.uploads.get(sessionId);
        if (!session)
            throw new Error("Session not found");
        session.status = "paused";
    }
    async cancel(sessionId) {
        this.uploads.delete(sessionId);
    }
    getProgress(sessionId) {
        const session = this.uploads.get(sessionId);
        return session ? session.progress || 0 : 0;
    }
    getSession(sessionId) {
        return this.uploads.get(sessionId);
    }
    getActiveSessions() {
        return Array.from(this.uploads.keys());
    }
    async close() {
        await this.client.close();
        this.uploads.clear();
    }
}
exports.ResumableUploader = ResumableUploader;
//# sourceMappingURL=ResumableUploader.js.map