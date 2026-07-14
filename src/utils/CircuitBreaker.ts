export class CircuitBreaker {
  private state: "closed" | "open" | "half-open";
  private failureCount: number;
  private successCount: number;
  private threshold: number;
  private timeout: number;
  private resetTimeout: number;
  private lastFailureTime: number;

  constructor(threshold?: number, timeout?: number, resetTimeout?: number) {
    this.state = "closed";
    this.failureCount = 0;
    this.successCount = 0;
    this.threshold = threshold || 5;
    this.timeout = timeout || 30000;
    this.resetTimeout = resetTimeout || 60000;
    this.lastFailureTime = 0;
  }

  public async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "open") {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = "half-open";
        this.successCount = 0;
      } else {
        throw new Error("Circuit breaker is open");
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    if (this.state === "half-open") {
      this.successCount++;
      if (this.successCount >= this.threshold) {
        this.reset();
      }
    } else {
      this.failureCount = 0;
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.threshold) {
      this.state = "open";
    }
  }

  private reset(): void {
    this.state = "closed";
    this.failureCount = 0;
    this.successCount = 0;
  }

  public getState(): string {
    return this.state;
  }

  public getFailureCount(): number {
    return this.failureCount;
  }

  public getSuccessCount(): number {
    return this.successCount;
  }

  public getThreshold(): number {
    return this.threshold;
  }

  public setThreshold(threshold: number): void {
    this.threshold = threshold;
  }

  public getTimeout(): number {
    return this.timeout;
  }

  public setTimeout(timeout: number): void {
    this.timeout = timeout;
  }

  public getResetTimeout(): number {
    return this.resetTimeout;
  }

  public setResetTimeout(timeout: number): void {
    this.resetTimeout = timeout;
  }

  public forceOpen(): void {
    this.state = "open";
    this.lastFailureTime = Date.now();
  }

  public forceClosed(): void {
    this.state = "closed";
    this.failureCount = 0;
    this.successCount = 0;
  }

  public forceHalfOpen(): void {
    this.state = "half-open";
    this.successCount = 0;
  }
}