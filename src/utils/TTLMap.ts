export class TTLMap<K, V> {
  private map: Map<K, V>;
  private timers: Map<K, number>;
  private defaultTTL: number;

  constructor(defaultTTL?: number) {
    this.map = new Map();
    this.timers = new Map();
    this.defaultTTL = defaultTTL || 60000;
  }

  public set(key: K, value: V, ttl?: number): void {
    this.map.set(key, value);
    const timeout = ttl || this.defaultTTL;
    this.timers.set(key, Date.now() + timeout);
  }

  public get(key: K): V | undefined {
    if (this.isExpired(key)) {
      this.delete(key);
      return undefined;
    }
    return this.map.get(key);
  }

  public has(key: K): boolean {
    if (this.isExpired(key)) {
      this.delete(key);
      return false;
    }
    return this.map.has(key);
  }

  public delete(key: K): boolean {
    this.timers.delete(key);
    return this.map.delete(key);
  }

  public clear(): void {
    this.map.clear();
    this.timers.clear();
  }

  public keys(): K[] {
    this.clean();
    return Array.from(this.map.keys());
  }

  public values(): V[] {
    this.clean();
    return Array.from(this.map.values());
  }

  public entries(): [K, V][] {
    this.clean();
    return Array.from(this.map.entries());
  }

  public size(): number {
    this.clean();
    return this.map.size;
  }

  private isExpired(key: K): boolean {
    const expiry = this.timers.get(key);
    if (!expiry) {
      return true;
    }
    return Date.now() > expiry;
  }

  private clean(): void {
    const now = Date.now();
    for (const [key, expiry] of this.timers) {
      if (now > expiry) {
        this.map.delete(key);
        this.timers.delete(key);
      }
    }
  }

  public getTTL(key: K): number {
    const expiry = this.timers.get(key);
    if (!expiry) {
      return -1;
    }
    return Math.max(0, expiry - Date.now());
  }

  public setDefaultTTL(ttl: number): void {
    this.defaultTTL = ttl;
  }

  public getDefaultTTL(): number {
    return this.defaultTTL;
  }

  public refresh(key: K): void {
    const expiry = this.timers.get(key);
    if (expiry) {
      this.timers.set(key, Date.now() + this.defaultTTL);
    }
  }
}