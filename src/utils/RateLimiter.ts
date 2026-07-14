export class RateLimiter {
  private limit: number;
  private interval: number;
  private tokens: number;
  private lastRefill: number;

  constructor(limit?: number, interval?: number) {
    this.limit = limit || 100;
    this.interval = interval || 60000;
    this.tokens = this.limit;
    this.lastRefill = Date.now();
  }

  public async wait(): Promise<void> {
    this.refill();
    if (this.tokens > 0) {
      this.tokens--;
      return;
    }

    const waitTime = this.interval / this.limit;
    await this.sleep(waitTime);
    return this.wait();
  }

  public async tryConsume(): Promise<boolean> {
    this.refill();
    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }
    return false;
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const refill = Math.floor(elapsed / (this.interval / this.limit));
    if (refill > 0) {
      this.tokens = Math.min(this.limit, this.tokens + refill);
      this.lastRefill = now;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public getTokens(): number {
    this.refill();
    return this.tokens;
  }

  public getLimit(): number {
    return this.limit;
  }

  public setLimit(limit: number): void {
    this.limit = limit;
    this.tokens = Math.min(this.tokens, this.limit);
  }

  public getInterval(): number {
    return this.interval;
  }

  public setInterval(interval: number): void {
    this.interval = interval;
  }

  public reset(): void {
    this.tokens = this.limit;
    this.lastRefill = Date.now();
  }
}