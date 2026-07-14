export class Semaphore {
  private count: number;
  private maxCount: number;
  private queue: Function[];

  constructor(maxCount: number) {
    this.count = maxCount;
    this.maxCount = maxCount;
    this.queue = [];
  }

  public async acquire(): Promise<void> {
    if (this.count > 0) {
      this.count--;
      return;
    }

    return new Promise((resolve) => {
      this.queue.push(resolve);
    });
  }

  public release(): void {
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      if (next) {
        next();
      }
    } else {
      this.count = Math.min(this.count + 1, this.maxCount);
    }
  }

  public getAvailable(): number {
    return this.count;
  }

  public getQueueLength(): number {
    return this.queue.length;
  }

  public getMaxCount(): number {
    return this.maxCount;
  }

  public setMaxCount(maxCount: number): void {
    this.maxCount = maxCount;
    this.count = Math.min(this.count, this.maxCount);
  }

  public clear(): void {
    this.queue = [];
    this.count = this.maxCount;
  }
}