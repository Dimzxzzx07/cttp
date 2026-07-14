import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
export declare class NotifyHandler implements IMethodHandler {
    private notifications;
    private subscribers;
    constructor();
    handle(request: IHTTPRequest): Promise<IHTTPResponse>;
    private generateNotificationId;
    private dispatchNotification;
    subscribe(event: string, callback: Function): void;
    unsubscribe(event: string, callback: Function): void;
    getNotifications(event?: string): any[];
    getNotification(id: string): any;
    clearNotifications(event?: string): void;
    getSubscriberCount(event: string): number;
}
//# sourceMappingURL=NotifyHandler.d.ts.map