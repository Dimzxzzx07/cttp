import { ConfigTypes } from "../types/ConfigTypes";
import { Constants } from "./Constants";

export class SharedBufferPool {
  private config: ConfigTypes.BufferConfig;
  private constants: Constants;
  private pools: Map<number, Buffer[]>;
  private poolSizes: Map<number, number>;
  private maxPoolSize: number;

  constructor(config: ConfigTypes.BufferConfig) {
    this.config = config;
    this.constants = new Constants();
    this.pools = new Map();
    this.poolSizes = new Map();
    this.maxPoolSize = config.maxPoolSize || 100;
  }

  public acquire(size: number): Buffer {
    const pool = this.pools.get(size);
    if (pool && pool.length > 0) {
      const buffer = pool.pop()!;
      this.updatePoolSize(size, -1);
      return buffer;
    }
    return Buffer.allocUnsafe(size);
  }

  public release(buffer: Buffer): void {
    const size = buffer.length;
    const pool = this.pools.get(size) || [];
    if (pool.length < this.maxPoolSize) {
      pool.push(buffer);
      this.pools.set(size, pool);
      this.updatePoolSize(size, 1);
    }
  }

  private updatePoolSize(size: number, delta: number): void {
    const current = this.poolSizes.get(size) || 0;
    this.poolSizes.set(size, Math.max(0, current + delta));
  }

  public getPoolSize(size: number): number {
    return this.poolSizes.get(size) || 0;
  }

  public getTotalSize(): number {
    let total = 0;
    for (const size of this.poolSizes.values()) {
      total += size;
    }
    return total;
  }

  public getPoolCount(): number {
    return this.pools.size;
  }

  public clear(): void {
    this.pools.clear();
    this.poolSizes.clear();
  }

  public setMaxPoolSize(size: number): void {
    this.maxPoolSize = size;
  }

  public getMaxPoolSize(): number {
    return this.maxPoolSize;
  }
}