export class ObjectPool<T> {
  private pool: T[];
  private factory: () => T;
  private reset: (obj: T) => void;
  private maxSize: number;

  constructor(factory: () => T, reset?: (obj: T) => void, maxSize?: number) {
    this.pool = [];
    this.factory = factory;
    this.reset = reset || ((obj: T) => {});
    this.maxSize = maxSize || 100;
  }

  public acquire(): T {
    if (this.pool.length > 0) {
      const obj = this.pool.pop()!;
      return obj;
    }
    return this.factory();
  }

  public release(obj: T): void {
    if (this.pool.length < this.maxSize) {
      this.reset(obj);
      this.pool.push(obj);
    }
  }

  public getSize(): number {
    return this.pool.length;
  }

  public getMaxSize(): number {
    return this.maxSize;
  }

  public setMaxSize(maxSize: number): void {
    this.maxSize = maxSize;
    while (this.pool.length > this.maxSize) {
      this.pool.pop();
    }
  }

  public clear(): void {
    this.pool = [];
  }

  public warmup(count: number): void {
    for (let i = 0; i < count && this.pool.length < this.maxSize; i++) {
      const obj = this.factory();
      this.pool.push(obj);
    }
  }
}