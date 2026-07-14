import { Constants } from "./Constants";
import { BufferUtils } from "../utils/BufferUtils";

export class HeaderCompressor {
  private constants: Constants;
  private bufferUtils: BufferUtils;
  private compressionLevel: number;
  private dictionary: Map<string, string>;

  constructor() {
    this.constants = new Constants();
    this.bufferUtils = new BufferUtils();
    this.compressionLevel = 6;
    this.dictionary = new Map();
    this.initializeDictionary();
  }

  private initializeDictionary(): void {
    const commonHeaders = [
      "host", "user-agent", "accept", "accept-encoding",
      "accept-language", "content-type", "content-length",
      "cache-control", "authorization", "cookie", "referer",
      "origin", "connection", "upgrade", "etag", "if-match",
      "if-none-match", "range", "x-request-id", "x-forwarded-for"
    ];
    for (const header of commonHeaders) {
      this.dictionary.set(header, this.hashHeader(header));
    }
  }

  private hashHeader(header: string): string {
    let hash = 0;
    for (let i = 0; i < header.length; i++) {
      hash = (hash << 5) - hash + header.charCodeAt(i);
      hash = hash & hash;
    }
    return hash.toString(16);
  }

  public compress(headers: Map<string, string>): Buffer {
    const result: Buffer[] = [];
    const compressed = new Map<string, string>();

    for (const [key, value] of headers) {
      const keyHash = this.dictionary.get(key);
      if (keyHash) {
        const encoded = this.encodeHeader(keyHash, value);
        compressed.set(keyHash, encoded);
      } else {
        const hash = this.hashHeader(key);
        this.dictionary.set(key, hash);
        const encoded = this.encodeHeader(hash, value);
        compressed.set(hash, encoded);
      }
    }

    const jsonString = JSON.stringify(Object.fromEntries(compressed));
    const buffer = Buffer.from(jsonString, "utf8");
    const compressedBuffer = this.compressBuffer(buffer);
    return compressedBuffer;
  }

  public decompress(data: Buffer): Map<string, string> {
    const decompressed = this.decompressBuffer(data);
    const jsonString = decompressed.toString("utf8");
    const parsed = JSON.parse(jsonString);
    const headers = new Map<string, string>();

    for (const [keyHash, value] of Object.entries(parsed)) {
      const key = this.findKeyByHash(keyHash);
      if (key) {
        const decoded = this.decodeHeader(value as string);
        headers.set(key, decoded);
      }
    }

    return headers;
  }

  private encodeHeader(hash: string, value: string): string {
    const encoded = Buffer.from(value, "utf8");
    const compressed = this.compressBuffer(encoded);
    return Buffer.concat([
      Buffer.from(hash, "hex"),
      Buffer.from([compressed.length]),
      compressed
    ]).toString("base64");
  }

  private decodeHeader(encoded: string): string {
    const buffer = Buffer.from(encoded, "base64");
    const length = buffer[32];
    const compressed = buffer.subarray(33, 33 + length);
    const decompressed = this.decompressBuffer(compressed);
    return decompressed.toString("utf8");
  }

  private compressBuffer(data: Buffer): Buffer {
    const zlib = require("zlib");
    return zlib.deflateSync(data, { level: this.compressionLevel });
  }

  private decompressBuffer(data: Buffer): Buffer {
    const zlib = require("zlib");
    return zlib.inflateSync(data);
  }

  private findKeyByHash(hash: string): string | undefined {
    for (const [key, value] of this.dictionary) {
      if (value === hash) {
        return key;
      }
    }
    return undefined;
  }

  public setCompressionLevel(level: number): void {
    this.compressionLevel = Math.max(1, Math.min(9, level));
  }

  public getCompressionLevel(): number {
    return this.compressionLevel;
  }

  public getDictionarySize(): number {
    return this.dictionary.size;
  }

  public addToDictionary(key: string): void {
    if (!this.dictionary.has(key)) {
      this.dictionary.set(key, this.hashHeader(key));
    }
  }

  public removeFromDictionary(key: string): void {
    this.dictionary.delete(key);
  }
}