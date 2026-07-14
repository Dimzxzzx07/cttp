import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
import { CTTPResponse } from "../core/CTTPResponse";
import { HTTPVersion } from "../core/HTTPVersion";

export class NotifyHandler implements IMethodHandler {
  private notifications: Map<string, any[]>;
  private subscribers: Map<string, Function[]>;

  constructor() {
    this.notifications = new Map();
    this.subscribers = new Map();
  }

  public async handle(request: IHTTPRequest): Promise<IHTTPResponse> {
    const body = request.getBody();
    const event = body?.event;
    const data = body?.data || {};
    const source = body?.source || request.getURL();
    const priority = body?.priority || "normal";
    
    if (!event) {
      return new CTTPResponse(
        400,
        "Bad Request",
        HTTPVersion.HTTP_1_1,
        new Map([["Content-Type", "application/json"]]),
        { error: "Missing event type" }
      );
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
    this.notifications.get(event)!.push(notification);
    
    this.dispatchNotification(event, notification);
    
    return new CTTPResponse(
      200,
      "OK",
      HTTPVersion.HTTP_1_1,
      new Map([["Content-Type", "application/json"]]),
      {
        id: notification.id,
        event,
        timestamp: notification.timestamp,
        status: "queued",
        message: "Notification queued successfully"
      }
    );
  }

  private generateNotificationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  private dispatchNotification(event: string, notification: any): void {
    const subscribers = this.subscribers.get(event) || [];
    for (const subscriber of subscribers) {
      try {
        subscriber(notification);
        notification.delivered = true;
      } catch (error) {
        console.error("Subscriber error:", error);
      }
    }
  }

  public subscribe(event: string, callback: Function): void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event)!.push(callback);
  }

  public unsubscribe(event: string, callback: Function): void {
    const subscribers = this.subscribers.get(event);
    if (subscribers) {
      const index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
    }
  }

  public getNotifications(event?: string): any[] {
    if (event) {
      return this.notifications.get(event) || [];
    }
    const all: any[] = [];
    for (const notifs of this.notifications.values()) {
      all.push(...notifs);
    }
    return all;
  }

  public getNotification(id: string): any {
    for (const notifs of this.notifications.values()) {
      const found = notifs.find(n => n.id === id);
      if (found) {
        return found;
      }
    }
    return null;
  }

  public clearNotifications(event?: string): void {
    if (event) {
      this.notifications.delete(event);
    } else {
      this.notifications.clear();
    }
  }

  public getSubscriberCount(event: string): number {
    return (this.subscribers.get(event) || []).length;
  }
}