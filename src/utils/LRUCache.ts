export class LRUCache<K, V> {
  private cache: Map<K, V>;
  private maxSize: number;

  constructor(maxSize: number) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  public get(key: K): V | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }

    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  public set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, value);
  }

  public has(key: K): boolean {
    return this.cache.has(key);
  }

  public delete(key: K): boolean {
    return this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }

  public size(): number {
    return this.cache.size;
  }

  public getMaxSize(): number {
    return this.maxSize;
  }

  public setMaxSize(maxSize: number): void {
    this.maxSize = maxSize;
    while (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
  }

  public keys(): K[] {
    return Array.from(this.cache.keys());
  }

  public values(): V[] {
    return Array.from(this.cache.values());
  }

  public entries(): [K, V][] {
    return Array.from(this.cache.entries());
  }

  public getStats(): any {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      utilization: (this.cache.size / this.maxSize) * 100
    };
  }
}