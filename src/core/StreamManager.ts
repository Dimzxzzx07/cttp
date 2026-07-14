export class StreamManager {
  private streams: Map<number, any>;
  private nextStreamId: number;
  private maxStreams: number;
  private streamStates: Map<number, string>;

  constructor() {
    this.streams = new Map();
    this.nextStreamId = 1;
    this.maxStreams = 100;
    this.streamStates = new Map();
  }

  public allocateStream(): number {
    const streamId = this.nextStreamId;
    this.nextStreamId += 2;
    this.streams.set(streamId, {});
    this.streamStates.set(streamId, "idle");
    return streamId;
  }

  public getStream(streamId: number): any {
    return this.streams.get(streamId);
  }

  public closeStream(streamId: number): void {
    this.streams.delete(streamId);
    this.streamStates.delete(streamId);
  }

  public getState(streamId: number): string {
    return this.streamStates.get(streamId) || "closed";
  }

  public setState(streamId: number, state: string): void {
    this.streamStates.set(streamId, state);
  }

  public getActiveStreams(): number {
    return this.streams.size;
  }

  public getMaxStreams(): number {
    return this.maxStreams;
  }

  public setMaxStreams(max: number): void {
    this.maxStreams = max;
  }

  public isStreamOpen(streamId: number): boolean {
    return this.streams.has(streamId);
  }

  public getNextStreamId(): number {
    return this.nextStreamId;
  }

  public reset(): void {
    this.streams.clear();
    this.streamStates.clear();
    this.nextStreamId = 1;
  }
}