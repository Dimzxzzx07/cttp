export namespace StreamTypes {
  export interface StreamOptions {
    event?: string;
    encoding?: "json" | "base64" | "utf8";
    chunkSize?: number;
    timeout?: number;
  }

  export interface StreamEvent {
    id: string;
    event: string;
    data: any;
    timestamp: number;
  }

  export interface StreamState {
    id: string;
    status: "active" | "paused" | "closed";
    createdAt: number;
    lastActivity: number;
    dataSize: number;
    events: StreamEvent[];
  }
}