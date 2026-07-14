export class SlidingWindow {
  private window: number[];
  private size: number;
  private sum: number;

  constructor(size: number) {
    this.window = [];
    this.size = size;
    this.sum = 0;
  }

  public add(value: number): void {
    this.window.push(value);
    this.sum += value;
    if (this.window.length > this.size) {
      const removed = this.window.shift();
      if (removed !== undefined) {
        this.sum -= removed;
      }
    }
  }

  public getAverage(): number {
    if (this.window.length === 0) {
      return 0;
    }
    return this.sum / this.window.length;
  }

  public getSum(): number {
    return this.sum;
  }

  public getMin(): number {
    if (this.window.length === 0) {
      return 0;
    }
    return Math.min(...this.window);
  }

  public getMax(): number {
    if (this.window.length === 0) {
      return 0;
    }
    return Math.max(...this.window);
  }

  public getWindow(): number[] {
    return [...this.window];
  }

  public getSize(): number {
    return this.window.length;
  }

  public getMaxSize(): number {
    return this.size;
  }

  public setMaxSize(size: number): void {
    this.size = size;
    while (this.window.length > size) {
      const removed = this.window.shift();
      if (removed !== undefined) {
        this.sum -= removed;
      }
    }
  }

  public clear(): void {
    this.window = [];
    this.sum = 0;
  }

  public isFull(): boolean {
    return this.window.length === this.size;
  }
}