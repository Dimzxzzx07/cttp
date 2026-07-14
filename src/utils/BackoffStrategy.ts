export class BackoffStrategy {
  private baseDelay: number;
  private maxDelay: number;
  private multiplier: number;
  private jitter: boolean;

  constructor(baseDelay?: number, maxDelay?: number, multiplier?: number, jitter?: boolean) {
    this.baseDelay = baseDelay || 1000;
    this.maxDelay = maxDelay || 30000;
    this.multiplier = multiplier || 2;
    this.jitter = jitter !== undefined ? jitter : true;
  }

  public getDelay(attempt: number): number {
    let delay = this.baseDelay * Math.pow(this.multiplier, attempt);
    delay = Math.min(delay, this.maxDelay);

    if (this.jitter) {
      const jitterAmount = delay * 0.1;
      delay = delay + (Math.random() * jitterAmount * 2 - jitterAmount);
    }

    return Math.max(0, delay);
  }

  public reset(): void {
  }

  public getBaseDelay(): number {
    return this.baseDelay;
  }

  public setBaseDelay(delay: number): void {
    this.baseDelay = delay;
  }

  public getMaxDelay(): number {
    return this.maxDelay;
  }

  public setMaxDelay(delay: number): void {
    this.maxDelay = delay;
  }

  public getMultiplier(): number {
    return this.multiplier;
  }

  public setMultiplier(multiplier: number): void {
    this.multiplier = multiplier;
  }

  public hasJitter(): boolean {
    return this.jitter;
  }

  public setJitter(jitter: boolean): void {
    this.jitter = jitter;
  }
}