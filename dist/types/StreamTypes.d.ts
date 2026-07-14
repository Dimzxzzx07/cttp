export declare namespace StreamTypes {
    interface StreamOptions {
        event?: string;
        encoding?: "json" | "base64" | "utf8";
        chunkSize?: number;
        timeout?: number;
    }
    interface StreamEvent {
        id: string;
        event: string;
        data: any;
        timestamp: number;
    }
    interface StreamState {
        id: string;
        status: "active" | "paused" | "closed";
        createdAt: number;
        lastActivity: number;
        dataSize: number;
        events: StreamEvent[];
    }
}
//# sourceMappingURL=StreamTypes.d.ts.map