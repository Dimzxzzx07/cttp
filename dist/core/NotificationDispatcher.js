"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationDispatcher = void 0;
const CTTPClient_1 = require("./CTTPClient");
const CTTPRequest_1 = require("./CTTPRequest");
const HTTPMethod_1 = require("./HTTPMethod");
const BufferUtils_1 = require("../utils/BufferUtils");
const CryptoUtils_1 = require("../utils/CryptoUtils");
const Constants_1 = require("./Constants");
class NotificationDispatcher {
    constructor(config) {
        this.config = config;
        this.constants = new Constants_1.Constants();
        this.bufferUtils = new BufferUtils_1.BufferUtils();
        this.cryptoUtils = new CryptoUtils_1.CryptoUtils();
        this.client = new CTTPClient_1.CTTPClient();
        this.subscribers = new Map();
        this.notificationQueue = [];
        this.isProcessing = false;
        this.startProcessing();
    }
    async notify(url, options) {
        const notification = {
            id: this.generateNotificationId(),
            event: options.event,
            data: options.data,
            timestamp: Date.now(),
            priority: options.priority || "normal",
            source: options.source || url
        };
        const request = new CTTPRequest_1.CTTPRequest(HTTPMethod_1.HTTPMethod.NOTIFY, url, {
            body: notification,
            timeout: this.config.timeout || 10000
        });
        await this.client.request(request);
        this.notificationQueue.push(notification);
        this.emitNotification(notification);
    }
    generateNotificationId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
    emitNotification(notification) {
        const subscribers = this.subscribers.get(notification.event) || [];
        for (const subscriber of subscribers) {
            try {
                subscriber(notification);
            }
            catch (error) {
                console.error("Subscriber error:", error);
            }
        }
    }
    subscribe(event, callback) {
        if (!this.subscribers.has(event)) {
            this.subscribers.set(event, []);
        }
        this.subscribers.get(event).push(callback);
    }
    unsubscribe(event, callback) {
        const subscribers = this.subscribers.get(event);
        if (subscribers) {
            const index = subscribers.indexOf(callback);
            if (index > -1) {
                subscribers.splice(index, 1);
            }
        }
    }
    async broadcast(event, data, options) {
        const urls = this.config.broadcastUrls || [];
        const promises = urls.map(url => this.notify(url, { event, data, ...options }));
        await Promise.all(promises);
    }
    async startProcessing() {
        this.isProcessing = true;
        while (this.isProcessing) {
            if (this.notificationQueue.length > 0) {
                const notification = this.notificationQueue.shift();
                if (notification) {
                    await this.processNotification(notification);
                }
            }
            await this.sleep(100);
        }
    }
    async processNotification(notification) {
        if (this.config.retryOnFailure) {
            let attempts = 0;
            let success = false;
            while (!success && attempts < this.config.maxRetries) {
                try {
                    await this.sendNotification(notification);
                    success = true;
                }
                catch (error) {
                    attempts++;
                    await this.sleep(this.config.retryDelay || 1000);
                }
            }
        }
    }
    async sendNotification(notification) {
        const request = new CTTPRequest_1.CTTPRequest(HTTPMethod_1.HTTPMethod.POST, "/notify/internal", { body: notification });
        await this.client.request(request);
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    getQueueLength() {
        return this.notificationQueue.length;
    }
    getSubscribers(event) {
        return (this.subscribers.get(event) || []).length;
    }
    clearQueue() {
        this.notificationQueue = [];
    }
    async close() {
        this.isProcessing = false;
        await this.client.close();
        this.subscribers.clear();
        this.notificationQueue = [];
    }
}
exports.NotificationDispatcher = NotificationDispatcher;
//# sourceMappingURL=NotificationDispatcher.js.map