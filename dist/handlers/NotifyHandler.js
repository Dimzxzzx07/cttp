"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotifyHandler = void 0;
const CTTPResponse_1 = require("../core/CTTPResponse");
const HTTPVersion_1 = require("../core/HTTPVersion");
class NotifyHandler {
    constructor() {
        this.notifications = new Map();
        this.subscribers = new Map();
    }
    async handle(request) {
        const body = request.getBody();
        const event = body?.event;
        const data = body?.data || {};
        const source = body?.source || request.getURL();
        const priority = body?.priority || "normal";
        if (!event) {
            return new CTTPResponse_1.CTTPResponse(400, "Bad Request", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), { error: "Missing event type" });
        }
        const notification = {
            id: this.generateNotificationId(),
            event,
            data,
            source,
            priority,
            timestamp: Date.now(),
            delivered: false
        };
        if (!this.notifications.has(event)) {
            this.notifications.set(event, []);
        }
        this.notifications.get(event).push(notification);
        this.dispatchNotification(event, notification);
        return new CTTPResponse_1.CTTPResponse(200, "OK", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), {
            id: notification.id,
            event,
            timestamp: notification.timestamp,
            status: "queued",
            message: "Notification queued successfully"
        });
    }
    generateNotificationId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
    dispatchNotification(event, notification) {
        const subscribers = this.subscribers.get(event) || [];
        for (const subscriber of subscribers) {
            try {
                subscriber(notification);
                notification.delivered = true;
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
    getNotifications(event) {
        if (event) {
            return this.notifications.get(event) || [];
        }
        const all = [];
        for (const notifs of this.notifications.values()) {
            all.push(...notifs);
        }
        return all;
    }
    getNotification(id) {
        for (const notifs of this.notifications.values()) {
            const found = notifs.find(n => n.id === id);
            if (found) {
                return found;
            }
        }
        return null;
    }
    clearNotifications(event) {
        if (event) {
            this.notifications.delete(event);
        }
        else {
            this.notifications.clear();
        }
    }
    getSubscriberCount(event) {
        return (this.subscribers.get(event) || []).length;
    }
}
exports.NotifyHandler = NotifyHandler;
//# sourceMappingURL=NotifyHandler.js.map