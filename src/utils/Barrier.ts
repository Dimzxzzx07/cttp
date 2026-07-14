export class Barrier {
  private count: number;
  private initialCount: number;
  private waiting: Function[];
  private isBroken: boolean;

  constructor(count: number) {
    this.count = count;
    this.initialCount = count;
    this.waiting = [];
    this.isBroken = false;
  }

  public async wait(): Promise<void> {
    if (this.isBroken) {
      throw new Error("Barrier is broken");
    }

    this.count--;

    if (this.count === 0) {
      this.releaseAll();
      return;
    }

    return new Promise((resolve, reject) => {
      this.waiting.push(resolve);
    });
  }

  private releaseAll(): void {
    for (const resolve of this.waiting) {
      resolve();
    }
    this.waiting = [];
    this.count = this.initialCount;
  }

  public break(): void {
    this.isBroken = true;
    for (const resolve of this.waiting) {
      resolve();
    }
    this.waiting = [];
  }

  public reset(): void {
    this.isBroken = false;
    this.count = this.initialCount;
    this.waiting = [];
  }

  public getCount(): number {
    return this.count;
  }

  public getInitialCount(): number {
    return this.initialCount;
  }

  public getWaitingCount(): number {
    return this.waiting.length;
  }

  public isBrokenState(): boolean {
    return this.isBroken;
  }
}