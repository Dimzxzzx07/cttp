"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CTTPClient = void 0;
const CTTPResponse_1 = require("./CTTPResponse");
const HTTPVersion_1 = require("./HTTPVersion");
const ConnectionPool_1 = require("./ConnectionPool");
const DNSResolver_1 = require("./DNSResolver");
const TLSSession_1 = require("./TLSSession");
const QUICSession_1 = require("./QUICSession");
const HTTPTunnel_1 = require("./HTTPTunnel");
const MethodInterceptor_1 = require("./MethodInterceptor");
const CustomMethodRegistry_1 = require("./CustomMethodRegistry");
const ResumableUploader_1 = require("./ResumableUploader");
const SyncEngine_1 = require("./SyncEngine");
const MergeEngine_1 = require("./MergeEngine");
const AuditLogger_1 = require("./AuditLogger");
const UndoManager_1 = require("./UndoManager");
const VerificationEngine_1 = require("./VerificationEngine");
const HealthChecker_1 = require("./HealthChecker");
const NotificationDispatcher_1 = require("./NotificationDispatcher");
const TokenManager_1 = require("./TokenManager");
const MemoryPinner_1 = require("./MemoryPinner");
const ZeroBuffer_1 = require("./ZeroBuffer");
const SharedBufferPool_1 = require("./SharedBufferPool");
const WorkerThreadManager_1 = require("./WorkerThreadManager");
const TaskScheduler_1 = require("./TaskScheduler");
const EventEmitter_1 = require("./EventEmitter");
const Logger_1 = require("./Logger");
const ConfigManager_1 = require("./ConfigManager");
const ErrorHandler_1 = require("./ErrorHandler");
const Constants_1 = require("./Constants");
class CTTPClient {
    constructor(config) {
        this.configManager = new ConfigManager_1.ConfigManager(config);
        this.config = this.configManager.getConfig();
        this.constants = new Constants_1.Constants();
        this.logger = new Logger_1.Logger(this.config.logLevel || "info");
        this.errorHandler = new ErrorHandler_1.ErrorHandler(this.logger);
        this.eventEmitter = new EventEmitter_1.EventEmitter();
        this.dnsResolver = new DNSResolver_1.DNSResolver({});
        this.connectionPool = new ConnectionPool_1.ConnectionPool({});
        this.tlsSession = new TLSSession_1.TLSSession({});
        this.quicSession = new QUICSession_1.QUICSession({});
        this.httpTunnel = new HTTPTunnel_1.HTTPTunnel({});
        this.methodInterceptor = new MethodInterceptor_1.MethodInterceptor({});
        this.customMethodRegistry = new CustomMethodRegistry_1.CustomMethodRegistry();
        this.resumableUploader = new ResumableUploader_1.ResumableUploader({});
        this.syncEngine = new SyncEngine_1.SyncEngine({});
        this.mergeEngine = new MergeEngine_1.MergeEngine({});
        this.auditLogger = new AuditLogger_1.AuditLogger({});
        this.undoManager = new UndoManager_1.UndoManager({});
        this.verificationEngine = new VerificationEngine_1.VerificationEngine({});
        this.healthChecker = new HealthChecker_1.HealthChecker({});
        this.notificationDispatcher = new NotificationDispatcher_1.NotificationDispatcher({});
        this.tokenManager = new TokenManager_1.TokenManager({});
        this.memoryPinner = new MemoryPinner_1.MemoryPinner({});
        this.zeroBuffer = new ZeroBuffer_1.ZeroBuffer({});
        this.sharedBufferPool = new SharedBufferPool_1.SharedBufferPool({});
        this.workerThreadManager = new WorkerThreadManager_1.WorkerThreadManager({});
        this.taskScheduler = new TaskScheduler_1.TaskScheduler();
        this.state = {
            connected: false,
            authenticated: false,
            sessionId: null,
            lastRequestTime: 0,
            requestCount: 0,
            errorCount: 0,
            bytesTransferred: 0
        };
    }
    async request(request) {
        return new CTTPResponse_1.CTTPResponse(200, "OK", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map(), {});
    }
    async get(url, options) {
        return this.request({ method: "GET", url, ...options });
    }
    async post(url, options) {
        return this.request({ method: "POST", url, ...options });
    }
    async put(url, options) {
        return this.request({ method: "PUT", url, ...options });
    }
    async patch(url, options) {
        return this.request({ method: "PATCH", url, ...options });
    }
    async delete(url, options) {
        return this.request({ method: "DELETE", url, ...options });
    }
    async head(url, options) {
        return this.request({ method: "HEAD", url, ...options });
    }
    async options(url, options) {
        return this.request({ method: "OPTIONS", url, ...options });
    }
    async login(url, credentials) {
        return this.request({ method: "LOGIN", url, body: credentials });
    }
    async logout(url, token) {
        return this.request({ method: "LOGOUT", url, body: { token } });
    }
    async refresh(url, refreshToken) {
        return this.request({ method: "REFRESH", url, body: { refreshToken } });
    }
    async sync(url, options) {
        return this.request({ method: "SYNC", url, body: options });
    }
    async merge(url, options) {
        return this.request({ method: "MERGE", url, body: options });
    }
    async stream(url, options) {
        return this.request({ method: "STREAM", url, body: options });
    }
    async upload(url, options) {
        return this.request({ method: "UPLOAD", url, body: options });
    }
    async convert(url, options) {
        return this.request({ method: "CONVERT", url, body: options });
    }
    async archive(url, options) {
        return this.request({ method: "ARCHIVE", url, body: options });
    }
    async audit(url, options) {
        return this.request({ method: "AUDIT", url, body: options });
    }
    async verify(url, options) {
        return this.request({ method: "VERIFY", url, body: options });
    }
    async ping(url, options) {
        return this.request({ method: "PING", url, body: options });
    }
    async notify(url, options) {
        return this.request({ method: "NOTIFY", url, body: options });
    }
    async undo(url, options) {
        return this.request({ method: "UNDO", url, body: options });
    }
    async resumableUpload(url, file, options) {
        return this.upload(url, { file, resumable: true, ...options });
    }
    async pingHealth(url) {
        try {
            const response = await this.ping(url);
            return response.getStatus() === 200;
        }
        catch {
            return false;
        }
    }
    async syncData(url, lastSync, options) {
        const response = await this.sync(url, { lastSync, ...options });
        return response.getBody();
    }
    async mergeData(url, conflicts, options) {
        const response = await this.merge(url, { conflicts, ...options });
        return response.getBody();
    }
    async auditLogs(url, options) {
        const response = await this.audit(url, options);
        return response.getBody();
    }
    async undoLast(url, options) {
        const response = await this.undo(url, options);
        return response.getBody();
    }
    async convertFile(url, file, targetFormat, options) {
        const response = await this.convert(url, { file, targetFormat, ...options });
        return response.getBody();
    }
    async archiveData(url, options) {
        const response = await this.archive(url, options);
        return response.getBody();
    }
    async notifyEvent(url, event, data) {
        await this.notify(url, { event, data });
    }
    async verifyOTP(url, otp) {
        const response = await this.verify(url, { type: "otp", value: otp });
        return response.getBody().valid === true;
    }
    async verifyEmail(url, email) {
        const response = await this.verify(url, { type: "email", value: email });
        return response.getBody().valid === true;
    }
    async close() {
        await this.connectionPool.close();
        await this.tlsSession.close();
        await this.quicSession.close();
        await this.httpTunnel.close();
        await this.workerThreadManager.shutdown();
    }
    on(event, listener) {
        this.eventEmitter.on(event, listener);
    }
    off(event, listener) {
        this.eventEmitter.off(event, listener);
    }
    emit(event, data) {
        this.eventEmitter.emit(event, data);
    }
    getState() {
        return { ...this.state };
    }
    getConfig() {
        return { ...this.config };
    }
    setConfig(config) {
        this.configManager.update(config);
        this.config = this.configManager.getConfig();
    }
}
exports.CTTPClient = CTTPClient;
//# sourceMappingURL=CTTPClient.js.map