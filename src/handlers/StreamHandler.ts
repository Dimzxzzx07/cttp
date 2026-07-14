import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
import { CTTPResponse } from "../core/CTTPResponse";
import { HTTPVersion } from "../core/HTTPVersion";

export class StreamHandler implements IMethodHandler {
  private streams: Map<string, any>;
  private eventListeners: Map<string, Function[]>;

  constructor() {
    this.streams = new Map();
    this.eventListeners = new Map();
  }

  public async handle(request: IHTTPRequest): Promise<IHTTPResponse> {
    const body = request.getBody();
    const event = body?.event || "data";
    const data = body?.data || {};
    const encoding = body?.encoding || "json";
    const streamId = body?.streamId || this.generateStreamId();

    if (!this.streams.has(streamId)) {
      this.streams.set(streamId, {
        id: streamId,
        event,
        encoding,
        data: [],
        listeners: new Set(),
        status: "active",
        createdAt: Date.now()
      });
    }

    const stream = this.streams.get(streamId);
    const chunk = this.encodeData(data, encoding);
    stream.data.push(chunk);

    this.emitEvent(streamId, event, data);

    return new CTTPResponse(
      200,
      "OK",
      HTTPVersion.HTTP_1_1,
      new Map([
        ["Content-Type", "text/event-stream"],
        ["Cache-Control", "no-cache"],
        ["Connection", "keep-alive"]
      ]),
      {
        streamId,
        event,
        data: chunk,
        timestamp: Date.now(),
        status: "streaming"
      }
    );
  }

  private generateStreamId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  private encodeData(data: any, encoding: string): Buffer {
    if (Buffer.isBuffer(data)) {
      return data;
    }
    if (typeof data === "string") {
      return Buffer.from(data, encoding === "base64" ? "base64" : "utf8");
    }
    return Buffer.from(JSON.stringify(data), "utf8");
  }

  private emitEvent(streamId: string, event: string, data: any): void {
    const listeners = this.eventListeners.get(`${streamId}:${event}`) || [];
    for (const listener of listeners) {
      try {
        listener(data);
      } catch (error) {
        console.error("Stream listener error:", error);
      }
    }
  }

  public on(streamId: string, event: string, callback: Function): void {
    const key = `${streamId}:${event}`;
    if (!this.eventListeners.has(key)) {
      this.eventListeners.set(key, []);
    }
    this.eventListeners.get(key)!.push(callback);
  }

  public off(streamId: string, event: string, callback: Function): void {
    const key = `${streamId}:${event}`;
    const listeners = this.eventListeners.get(key);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  public getStream(streamId: string): any {
    return this.streams.get(streamId);
  }

  public getStreams(): any[] {
    return Array.from(this.streams.values());
  }

  public closeStream(streamId: string): void {
    const stream = this.streams.get(streamId);
    if (stream) {
      stream.status = "closed";
      this.streams.delete(streamId);
    }
  }

  public closeAll(): void {
    for (const [id, stream] of this.streams) {
      stream.status = "closed";
    }
    this.streams.clear();
    this.eventListeners.clear();
  }

  public getStreamData(streamId: string): any[] {
    const stream = this.streams.get(streamId);
    return stream ? stream.data : [];
  }

  public clearStreamData(streamId: string): void {
    const stream = this.streams.get(streamId);
    if (stream) {
      stream.data = [];
    }
  }
}