export class FlowController {
  private windowSize: number;
  private initialWindowSize: number;
  private usedWindow: number;
  private maxWindowSize: number;
  private streamWindows: Map<number, number>;

  constructor() {
    this.windowSize = 65535;
    this.initialWindowSize = 65535;
    this.usedWindow = 0;
    this.maxWindowSize = 2147483647;
    this.streamWindows = new Map();
  }

  public updateWindowSize(windowSize: number): void {
    this.windowSize = Math.min(windowSize, this.maxWindowSize);
  }

  public getWindowSize(): number {
    return this.windowSize;
  }

  public getAvailableWindow(): number {
    return this.windowSize - this.usedWindow;
  }

  public consumeWindow(size: number): boolean {
    if (this.usedWindow + size <= this.windowSize) {
      this.usedWindow += size;
      return true;
    }
    return false;
  }

  public releaseWindow(size: number): void {
    this.usedWindow = Math.max(0, this.usedWindow - size);
  }

  public resetWindow(): void {
    this.usedWindow = 0;
    this.windowSize = this.initialWindowSize;
  }

  public getStreamWindow(streamId: number): number {
    return this.streamWindows.get(streamId) || this.initialWindowSize;
  }

  public updateStreamWindow(streamId: number, windowSize: number): void {
    this.streamWindows.set(streamId, Math.min(windowSize, this.maxWindowSize));
  }

  public getStreamAvailable(streamId: number): number {
    const window = this.getStreamWindow(streamId);
    const used = this.getStreamUsed(streamId);
    return window - used;
  }

  private getStreamUsed(streamId: number): number {
    return 0;
  }

  public consumeStreamWindow(streamId: number, size: number): boolean {
    const window = this.getStreamWindow(streamId);
    const used = this.getStreamUsed(streamId);
    if (used + size <= window) {
      return true;
    }
    return false;
  }

  public releaseStreamWindow(streamId: number, size: number): void {
  }

  public resetStreamWindow(streamId: number): void {
    this.streamWindows.delete(streamId);
  }

  public setInitialWindowSize(size: number): void {
    this.initialWindowSize = Math.min(size, this.maxWindowSize);
    this.windowSize = this.initialWindowSize;
  }

  public getInitialWindowSize(): number {
    return this.initialWindowSize;
  }

  public getMaxWindowSize(): number {
    return this.maxWindowSize;
  }

  public setMaxWindowSize(size: number): void {
    this.maxWindowSize = size;
  }

  public isWindowFull(): boolean {
    return this.getAvailableWindow() <= 0;
  }

  public isStreamWindowFull(streamId: number): boolean {
    return this.getStreamAvailable(streamId) <= 0;
  }
}