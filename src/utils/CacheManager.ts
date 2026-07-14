export class CacheManager {
  private cache: Map<string, any>;
  private maxSize: number;
  private ttl: number;

  constructor(maxSize?: number, ttl?: number) {
    this.cache = new Map();
    this.maxSize = maxSize || 1000;
    this.ttl = ttl || 3600000;
  }

  public set(key: string, value: any, ttl?: number): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    const entry = {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.ttl
    };

    this.cache.set(key, entry);
  }

  public get(key: string): any {
    const entry = this.cache.get(key);
    if (!entry) {
      return undefined;
    }

    const elapsed = Date.now() - entry.timestamp;
    if (elapsed > entry.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  public has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    const elapsed = Date.now() - entry.timestamp;
    if (elapsed > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  public remove(key: string): void {
    this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }

  public getSize(): number {
    this.cleanExpired();
    return this.cache.size;
  }

  public getMaxSize(): number {
    return this.maxSize;
  }

  public setMaxSize(maxSize: number): void {
    this.maxSize = maxSize;
    while (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
  }

  public getTTL(): number {
    return this.ttl;
  }

  public setTTL(ttl: number): void {
    this.ttl = ttl;
  }

  public cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  public getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  public getStats(): any {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        timestamp: entry.timestamp,
        age: Date.now() - entry.timestamp,
        ttl: entry.ttl,
        expired: Date.now() - entry.timestamp > entry.ttl
      }))
    };
  }
}