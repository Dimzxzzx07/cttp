export class StringPool {
  private pool: Map<string, string>;
  private maxSize: number;

  constructor(maxSize?: number) {
    this.pool = new Map();
    this.maxSize = maxSize || 10000;
  }

  public intern(str: string): string {
    const existing = this.pool.get(str);
    if (existing) {
      return existing;
    }

    if (this.pool.size >= this.maxSize) {
      const firstKey = this.pool.keys().next().value;
      if (firstKey) {
        this.pool.delete(firstKey);
      }
    }

    this.pool.set(str, str);
    return str;
  }

  public contains(str: string): boolean {
    return this.pool.has(str);
  }

  public getSize(): number {
    return this.pool.size;
  }

  public getMaxSize(): number {
    return this.maxSize;
  }

  public setMaxSize(maxSize: number): void {
    this.maxSize = maxSize;
    while (this.pool.size > this.maxSize) {
      const firstKey = this.pool.keys().next().value;
      if (firstKey) {
        this.pool.delete(firstKey);
      }
    }
  }

  public clear(): void {
    this.pool.clear();
  }

  public keys(): string[] {
    return Array.from(this.pool.keys());
  }

  public getStats(): any {
    return {
      size: this.pool.size,
      maxSize: this.maxSize,
      utilization: (this.pool.size / this.maxSize) * 100
    };
  }
}