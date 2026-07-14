import { CTTPClient } from "./CTTPClient";
import { CTTPRequest } from "./CTTPRequest";
import { CTTPResponse } from "./CTTPResponse";
import { HTTPMethod } from "./HTTPMethod";
import { ConfigTypes } from "../types/ConfigTypes";
import { NotifyTypes } from "../types/NotifyTypes";
import { BufferUtils } from "../utils/BufferUtils";
import { CryptoUtils } from "../utils/CryptoUtils";
import { Constants } from "./Constants";

export class NotificationDispatcher {
  private client: CTTPClient;
  private bufferUtils: BufferUtils;
  private cryptoUtils: CryptoUtils;
  private constants: Constants;
  private config: ConfigTypes.NotifyConfig;
  private subscribers: Map<string, Function[]>;
  private notificationQueue: any[];
  private isProcessing: boolean;

  constructor(config: ConfigTypes.NotifyConfig) {
    this.config = config;
    this.constants = new Constants();
    this.bufferUtils = new BufferUtils();
    this.cryptoUtils = new CryptoUtils();
    this.client = new CTTPClient();
    this.subscribers = new Map();
    this.notificationQueue = [];
    this.isProcessing = false;
    this.startProcessing();
  }

  public async notify(
    url: string,
    options: NotifyTypes.NotifyOptions
  ): Promise<void> {
    const notification: NotifyTypes.Notification = {
      id: this.generateNotificationId(),
      event: options.event,
      data: options.data,
      timestamp: Date.now(),
      priority: options.priority || "normal",
      source: options.source || url
    };
    
    const request = new CTTPRequest(
      HTTPMethod.NOTIFY,
      url,
      {
        body: notification,
        timeout: this.config.timeout || 10000
      }
    );
    
    await this.client.request(request);
    this.notificationQueue.push(notification);
    this.emitNotification(notification);
  }

  private generateNotificationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  private emitNotification(notification: NotifyTypes.Notification): void {
    const subscribers = this.subscribers.get(notification.event) || [];
    for (const subscriber of subscribers) {
      try {
        subscriber(notification);
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

  public async broadcast(
    event: string,
    data: any,
    options?: NotifyTypes.NotifyOptions
  ): Promise<void> {
    const urls = this.config.broadcastUrls || [];
    const promises = urls.map(url =>
      this.notify(url, { event, data, ...options })
    );
    await Promise.all(promises);
  }

  private async startProcessing(): Promise<void> {
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

  private async processNotification(notification: NotifyTypes.Notification): Promise<void> {
    if (this.config.retryOnFailure) {
      let attempts = 0;
      let success = false;
      while (!success && attempts < this.config.maxRetries) {
        try {
          await this.sendNotification(notification);
          success = true;
        } catch (error) {
          attempts++;
          await this.sleep(this.config.retryDelay || 1000);
        }
      }
    }
  }

  private async sendNotification(notification: NotifyTypes.Notification): Promise<void> {
    const request = new CTTPRequest(
      HTTPMethod.POST,
      "/notify/internal",
      { body: notification }
    );
    await this.client.request(request);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public getQueueLength(): number {
    return this.notificationQueue.length;
  }

  public getSubscribers(event: string): number {
    return (this.subscribers.get(event) || []).length;
  }

  public clearQueue(): void {
    this.notificationQueue = [];
  }

  public async close(): Promise<void> {
    this.isProcessing = false;
    await this.client.close();
    this.subscribers.clear();
    this.notificationQueue = [];
  }
}