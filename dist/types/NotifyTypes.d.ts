export declare namespace NotifyTypes {
    interface NotifyOptions {
        event: string;
        data: any;
        source?: string;
        priority?: "low" | "normal" | "high" | "critical";
        ttl?: number;
    }
    interface Notification {
        id: string;
        event: string;
        data: any;
        timestamp: number;
        priority: string;
        source: string;
        delivered?: boolean;
        deliveryAttempts?: number;
    }
    interface NotifyResponse {
        id: string;
        event: string;
        timestamp: number;
        status: string;
        message: string;
    }
}
//# sourceMappingURL=NotifyTypes.d.ts.map