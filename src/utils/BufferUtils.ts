export class BufferUtils {
  public concat(buffers: Buffer[]): Buffer {
    return Buffer.concat(buffers);
  }

  public slice(buffer: Buffer, start: number, end?: number): Buffer {
    return buffer.subarray(start, end);
  }

  public copy(source: Buffer, target: Buffer, targetStart?: number, sourceStart?: number, sourceEnd?: number): number {
    return source.copy(target, targetStart, sourceStart, sourceEnd);
  }

  public equals(a: Buffer, b: Buffer): boolean {
    return a.equals(b);
  }

  public compare(a: Buffer, b: Buffer): number {
    return a.compare(b);
  }

  public swap16(buffer: Buffer): Buffer {
    const result = Buffer.allocUnsafe(buffer.length);
    for (let i = 0; i < buffer.length; i += 2) {
      if (i + 1 < buffer.length) {
        result[i] = buffer[i + 1];
        result[i + 1] = buffer[i];
      }
    }
    return result;
  }

  public swap32(buffer: Buffer): Buffer {
    const result = Buffer.allocUnsafe(buffer.length);
    for (let i = 0; i < buffer.length; i += 4) {
      if (i + 3 < buffer.length) {
        result[i] = buffer[i + 3];
        result[i + 1] = buffer[i + 2];
        result[i + 2] = buffer[i + 1];
        result[i + 3] = buffer[i];
      }
    }
    return result;
  }

  public zero(buffer: Buffer): void {
    buffer.fill(0);
  }

  public isZero(buffer: Buffer): boolean {
    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] !== 0) {
        return false;
      }
    }
    return true;
  }

  public toHex(buffer: Buffer): string {
    return buffer.toString("hex");
  }

  public fromHex(hex: string): Buffer {
    return Buffer.from(hex, "hex");
  }

  public toBase64(buffer: Buffer): string {
    return buffer.toString("base64");
  }

  public fromBase64(base64: string): Buffer {
    return Buffer.from(base64, "base64");
  }

  public toUTF8(buffer: Buffer): string {
    return buffer.toString("utf8");
  }

  public fromUTF8(utf8: string): Buffer {
    return Buffer.from(utf8, "utf8");
  }

  public pad(buffer: Buffer, length: number, value: number = 0): Buffer {
    const result = Buffer.allocUnsafe(Math.max(buffer.length, length));
    result.fill(value);
    buffer.copy(result);
    return result;
  }

  public truncate(buffer: Buffer, length: number): Buffer {
    return buffer.subarray(0, Math.min(buffer.length, length));
  }

  public split(buffer: Buffer, delimiter: number): Buffer[] {
    const result: Buffer[] = [];
    let start = 0;
    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] === delimiter) {
        result.push(buffer.subarray(start, i));
        start = i + 1;
      }
    }
    if (start < buffer.length) {
      result.push(buffer.subarray(start));
    }
    return result;
  }

  public join(buffers: Buffer[], delimiter: number): Buffer {
    if (buffers.length === 0) {
      return Buffer.alloc(0);
    }
    const totalLength = buffers.reduce((sum, b) => sum + b.length, 0) + (buffers.length - 1);
    const result = Buffer.allocUnsafe(totalLength);
    let offset = 0;
    for (let i = 0; i < buffers.length; i++) {
      buffers[i].copy(result, offset);
      offset += buffers[i].length;
      if (i < buffers.length - 1) {
        result[offset++] = delimiter;
      }
    }
    return result;
  }
}