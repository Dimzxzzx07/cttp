export class DataTransformer {
  private transformers: Map<string, (data: any) => any>;
  private reverseTransformers: Map<string, (data: any) => any>;

  constructor() {
    this.transformers = new Map();
    this.reverseTransformers = new Map();
    this.registerDefaultTransformers();
  }

  private registerDefaultTransformers(): void {
    this.register("json", (data: any) => {
      if (typeof data === "string") {
        return JSON.parse(data);
      }
      return JSON.stringify(data);
    });

    this.register("base64", (data: any) => {
      if (typeof data === "string") {
        return Buffer.from(data, "base64");
      }
      return data.toString("base64");
    });

    this.register("hex", (data: any) => {
      if (typeof data === "string") {
        return Buffer.from(data, "hex");
      }
      return data.toString("hex");
    });

    this.register("utf8", (data: any) => {
      if (typeof data === "string") {
        return Buffer.from(data, "utf8");
      }
      return data.toString("utf8");
    });

    this.register("gzip", (data: any) => {
      const zlib = require("zlib");
      if (Buffer.isBuffer(data)) {
        return zlib.gzipSync(data);
      }
      return zlib.gunzipSync(data);
    });

    this.register("deflate", (data: any) => {
      const zlib = require("zlib");
      if (Buffer.isBuffer(data)) {
        return zlib.deflateSync(data);
      }
      return zlib.inflateSync(data);
    });

    this.register("brotli", (data: any) => {
      const zlib = require("zlib");
      if (Buffer.isBuffer(data)) {
        return zlib.brotliCompressSync(data);
      }
      return zlib.brotliDecompressSync(data);
    });
  }

  public register(name: string, transformer: (data: any) => any, reverse?: (data: any) => any): void {
    this.transformers.set(name, transformer);
    if (reverse) {
      this.reverseTransformers.set(name, reverse);
    }
  }

  public transform(data: any, type: string): any {
    const transformer = this.transformers.get(type);
    if (!transformer) {
      throw new Error(`Transformer ${type} not found`);
    }
    return transformer(data);
  }

  public reverse(data: any, type: string): any {
    const transformer = this.reverseTransformers.get(type);
    if (!transformer) {
      throw new Error(`Reverse transformer ${type} not found`);
    }
    return transformer(data);
  }

  public hasTransformer(type: string): boolean {
    return this.transformers.has(type);
  }

  public hasReverseTransformer(type: string): boolean {
    return this.reverseTransformers.has(type);
  }

  public getTransformerNames(): string[] {
    return Array.from(this.transformers.keys());
  }

  public removeTransformer(type: string): void {
    this.transformers.delete(type);
    this.reverseTransformers.delete(type);
  }

  public clear(): void {
    this.transformers.clear();
    this.reverseTransformers.clear();
  }
}