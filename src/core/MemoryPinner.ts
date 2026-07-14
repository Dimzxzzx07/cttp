import { ConfigTypes } from "../types/ConfigTypes";
import { Constants } from "./Constants";

export class MemoryPinner {
  private config: ConfigTypes.MemoryConfig;
  private constants: Constants;
  private pinnedBuffers: Map<string, Buffer>;
  private memoryLimit: number;
  private currentUsage: number;

  constructor(config: ConfigTypes.MemoryConfig) {
    this.config = config;
    this.constants = new Constants();
    this.pinnedBuffers = new Map();
    this.memoryLimit = config.memoryLimit || 1024 * 1024 * 100;
    this.currentUsage = 0;
  }

  public pinBuffer(id: string, buffer: Buffer): void {
    const size = buffer.length;
    if (this.currentUsage + size > this.memoryLimit) {
      this.unpinLRU();
    }
    const pinnedBuffer = Buffer.allocUnsafe(size);
    buffer.copy(pinnedBuffer);
    this.pinnedBuffers.set(id, pinnedBuffer);
    this.currentUsage += size;
  }

  public getPinnedBuffer(id: string): Buffer | undefined {
    const buffer = this.pinnedBuffers.get(id);
    if (buffer) {
      return Buffer.from(buffer);
    }
    return undefined;
  }

  public unpinBuffer(id: string): void {
    const buffer = this.pinnedBuffers.get(id);
    if (buffer) {
      this.currentUsage -= buffer.length;
      this.pinnedBuffers.delete(id);
      this.zeroBuffer(buffer);
    }
  }

  private unpinLRU(): void {
    if (this.pinnedBuffers.size === 0) {
      return;
    }
    const firstKey = this.pinnedBuffers.keys().next().value;
    if (firstKey) {
      this.unpinBuffer(firstKey);
    }
  }

  private zeroBuffer(buffer: Buffer): void {
    buffer.fill(0);
  }

  public getMemoryUsage(): number {
    return this.currentUsage;
  }

  public getMemoryLimit(): number {
    return this.memoryLimit;
  }

  public setMemoryLimit(limit: number): void {
    this.memoryLimit = limit;
  }

  public getPinnedCount(): number {
    return this.pinnedBuffers.size;
  }

  public clear(): void {
    for (const id of this.pinnedBuffers.keys()) {
      this.unpinBuffer(id);
    }
    this.pinnedBuffers.clear();
    this.currentUsage = 0;
  }
}