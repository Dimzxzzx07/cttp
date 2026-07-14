export interface INotify {
    notify(url: string, options: any): Promise<void>;
    subscribe(event: string, callback: Function): void;
    unsubscribe(event: string, callback: Function): void;
    broadcast(event: string, data: any, options?: any): Promise<void>;
    getNotifications(event?: string): any[];
}
//# sourceMappingURL=INotify.d.ts.map