import { ConfigTypes } from "../types/ConfigTypes";
import { Constants } from "./Constants";

export class ZeroBuffer {
  private config: ConfigTypes.ZeroConfig;
  private constants: Constants;
  private zeroedBuffers: Set<Buffer>;

  constructor(config: ConfigTypes.ZeroConfig) {
    this.config = config;
    this.constants = new Constants();
    this.zeroedBuffers = new Set();
  }

  public zero(buffer: Buffer): Buffer {
    if (this.config.enableZeroing !== false) {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = 0;
      }
      this.zeroedBuffers.add(buffer);
    }
    return buffer;
  }

  public zeroString(str: string): string {
    if (this.config.enableZeroing !== false) {
      const buffer = Buffer.from(str);
      this.zero(buffer);
      return buffer.toString();
    }
    return str;
  }

  public zeroObject(obj: any): any {
    if (this.config.enableZeroing !== false) {
      if (typeof obj === "string") {
        return this.zeroString(obj);
      }
      if (Buffer.isBuffer(obj)) {
        return this.zero(obj);
      }
      if (typeof obj === "object" && obj !== null) {
        for (const key of Object.keys(obj)) {
          if (typeof obj[key] === "string") {
            obj[key] = this.zeroString(obj[key]);
          } else if (Buffer.isBuffer(obj[key])) {
            obj[key] = this.zero(obj[key]);
          } else if (typeof obj[key] === "object") {
            this.zeroObject(obj[key]);
          }
        }
      }
    }
    return obj;
  }

  public isZeroed(buffer: Buffer): boolean {
    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] !== 0) {
        return false;
      }
    }
    return true;
  }

  public getZeroedCount(): number {
    return this.zeroedBuffers.size;
  }

  public clear(): void {
    this.zeroedBuffers.clear();
  }
}