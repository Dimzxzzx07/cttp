import { Logger } from "./Logger";
import { CTTPError } from "../errors/CTTPError";

export class ErrorHandler {
  private logger: Logger;
  private retryableErrors: Set<string>;
  private maxRetries: number;
  private retryDelay: number;

  constructor(logger: Logger) {
    this.logger = logger;
    this.retryableErrors = new Set([
      "ECONNRESET",
      "ECONNREFUSED",
      "ETIMEDOUT",
      "EPIPE",
      "ENOTFOUND"
    ]);
    this.maxRetries = 3;
    this.retryDelay = 1000;
  }

  public handle(error: any): void {
    if (error instanceof CTTPError) {
      this.logger.error(`CTTP Error: ${error.message}`, {
        status: error.getStatus(),
        code: error.getCode()
      });
    } else if (error instanceof Error) {
      this.logger.error(`Error: ${error.message}`, {
        stack: error.stack,
        name: error.name
      });
    } else {
      this.logger.error(`Unknown error: ${JSON.stringify(error)}`);
    }
  }

  public isRetryable(error: any): boolean {
    if (error instanceof CTTPError) {
      const status = error.getStatus();
      return status >= 500 || status === 429 || status === 408;
    }
    if (error instanceof Error) {
      const code = (error as any).code;
      if (code && this.retryableErrors.has(code)) {
        return true;
      }
    }
    return false;
  }

  public async retry<T>(
    fn: () => Promise<T>,
    maxRetries?: number,
    delay?: number
  ): Promise<T> {
    const retries = maxRetries || this.maxRetries;
    const waitTime = delay || this.retryDelay;
    let lastError: any;
    
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (!this.isRetryable(error) || i === retries - 1) {
          throw error;
        }
        this.logger.warn(`Retry attempt ${i + 1}/${retries} after error:`, error);
        await this.sleep(waitTime * Math.pow(2, i));
      }
    }
    throw lastError;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public setMaxRetries(maxRetries: number): void {
    this.maxRetries = maxRetries;
  }

  public getMaxRetries(): number {
    return this.maxRetries;
  }

  public setRetryDelay(delay: number): void {
    this.retryDelay = delay;
  }

  public getRetryDelay(): number {
    return this.retryDelay;
  }

  public addRetryableError(code: string): void {
    this.retryableErrors.add(code);
  }

  public removeRetryableError(code: string): void {
    this.retryableErrors.delete(code);
  }
}