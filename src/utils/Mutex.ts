export class Mutex {
  private locked: boolean;
  private queue: Function[];

  constructor() {
    this.locked = false;
    this.queue = [];
  }

  public async acquire(): Promise<void> {
    if (!this.locked) {
      this.locked = true;
      return;
    }

    return new Promise((resolve) => {
      this.queue.push(resolve);
    });
  }

  public release(): void {
    if (this.queue.length === 0) {
      this.locked = false;
      return;
    }

    const next = this.queue.shift();
    if (next) {
      next();
    }
  }

  public isLocked(): boolean {
    return this.locked;
  }

  public getQueueLength(): number {
    return this.queue.length;
  }

  public clear(): void {
    this.queue = [];
    this.locked = false;
  }
}