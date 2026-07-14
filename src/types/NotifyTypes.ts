export namespace NotifyTypes {
  export interface NotifyOptions {
    event: string;
    data: any;
    source?: string;
    priority?: "low" | "normal" | "high" | "critical";
    ttl?: number;
  }

  export interface Notification {
    id: string;
    event: string;
    data: any;
    timestamp: number;
    priority: string;
    source: string;
    delivered?: boolean;
    deliveryAttempts?: number;
  }

  export interface NotifyResponse {
    id: string;
    event: string;
    timestamp: number;
    status: string;
    message: string;
  }
}