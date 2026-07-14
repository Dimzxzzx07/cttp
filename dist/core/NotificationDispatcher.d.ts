import { ConfigTypes } from "../types/ConfigTypes";
import { NotifyTypes } from "../types/NotifyTypes";
export declare class NotificationDispatcher {
    private client;
    private bufferUtils;
    private cryptoUtils;
    private constants;
    private config;
    private subscribers;
    private notificationQueue;
    private isProcessing;
    constructor(config: ConfigTypes.NotifyConfig);
    notify(url: string, options: NotifyTypes.NotifyOptions): Promise<void>;
    private generateNotificationId;
    private emitNotification;
    subscribe(event: string, callback: Function): void;
    unsubscribe(event: string, callback: Function): void;
    broadcast(event: string, data: any, options?: NotifyTypes.NotifyOptions): Promise<void>;
    private startProcessing;
    private processNotification;
    private sendNotification;
    private sleep;
    getQueueLength(): number;
    getSubscribers(event: string): number;
    clearQueue(): void;
    close(): Promise<void>;
}
//# sourceMappingURL=NotificationDispatcher.d.ts.map