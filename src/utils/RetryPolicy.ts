export class RetryPolicy {
  private maxRetries: number;
  private initialDelay: number;
  private maxDelay: number;
  private retryableErrors: Set<string>;

  constructor(maxRetries?: number, initialDelay?: number, maxDelay?: number) {
    this.maxRetries = maxRetries || 3;
    this.initialDelay = initialDelay || 1000;
    this.maxDelay = maxDelay || 30000;
    this.retryableErrors = new Set([
      "ECONNRESET",
      "ECONNREFUSED",
      "ETIMEDOUT",
      "EPIPE",
      "ENOTFOUND",
      "EAI_AGAIN"
    ]);
  }

  public async execute<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: any;
    let delay = this.initialDelay;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (!this.shouldRetry(error) || attempt === this.maxRetries - 1) {
          throw error;
        }
        await this.wait(delay);
        delay = Math.min(delay * 2, this.maxDelay);
      }
    }

    throw lastError;
  }

  private shouldRetry(error: any): boolean {
    if (error instanceof Error) {
      const code = (error as any).code;
      if (code && this.retryableErrors.has(code)) {
        return true;
      }
      if (error.message && error.message.includes("timeout")) {
        return true;
      }
    }
    return false;
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public addRetryableError(code: string): void {
    this.retryableErrors.add(code);
  }

  public removeRetryableError(code: string): void {
    this.retryableErrors.delete(code);
  }

  public getMaxRetries(): number {
    return this.maxRetries;
  }

  public setMaxRetries(maxRetries: number): void {
    this.maxRetries = maxRetries;
  }

  public getInitialDelay(): number {
    return this.initialDelay;
  }

  public setInitialDelay(delay: number): void {
    this.initialDelay = delay;
  }

  public getMaxDelay(): number {
    return this.maxDelay;
  }

  public setMaxDelay(delay: number): void {
    this.maxDelay = delay;
  }

  public getRetryableErrors(): string[] {
    return Array.from(this.retryableErrors);
  }
}