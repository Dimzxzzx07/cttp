export class HeaderBuilder {
  private headers: Map<string, string>;

  constructor() {
    this.headers = new Map();
  }

  public add(key: string, value: string): void {
    this.headers.set(key, value);
  }

  public set(key: string, value: string): void {
    this.headers.set(key, value);
  }

  public get(key: string): string | undefined {
    return this.headers.get(key);
  }

  public remove(key: string): void {
    this.headers.delete(key);
  }

  public has(key: string): boolean {
    return this.headers.has(key);
  }

  public clear(): void {
    this.headers.clear();
  }

  public build(): Map<string, string> {
    return new Map(this.headers);
  }

  public toObject(): Record<string, string> {
    const obj: Record<string, string> = {};
    for (const [key, value] of this.headers) {
      obj[key] = value;
    }
    return obj;
  }

  public fromObject(obj: Record<string, string>): void {
    for (const [key, value] of Object.entries(obj)) {
      this.headers.set(key, value);
    }
  }

  public toBuffer(): Buffer {
    let result = "";
    for (const [key, value] of this.headers) {
      result += `${key}: ${value}\r\n`;
    }
    return Buffer.from(result);
  }

  public fromBuffer(buffer: Buffer): void {
    const lines = buffer.toString().split("\r\n");
    for (const line of lines) {
      if (!line.trim()) continue;
      const [key, ...valueParts] = line.split(":");
      if (key && valueParts.length > 0) {
        this.headers.set(key.trim(), valueParts.join(":").trim());
      }
    }
  }

  public clone(): HeaderBuilder {
    const builder = new HeaderBuilder();
    for (const [key, value] of this.headers) {
      builder.add(key, value);
    }
    return builder;
  }
}