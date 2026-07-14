import { IHTTPResponse } from "../interfaces/IHTTPResponse";
import { HTTPVersion } from "./HTTPVersion";
import { HeaderBuilder } from "../utils/HeaderBuilder";
import { Constants } from "./Constants";

export class CTTPResponse implements IHTTPResponse {
  private status: number;
  private statusText: string;
  private version: HTTPVersion;
  private headers: Map<string, string>;
  private body: any;
  private chunked: boolean;
  private compressed: boolean;
  private encrypted: boolean;
  private id: string;
  private timestamp: number;
  private duration: number;
  private url: string;
  private method: string;
  private constants: Constants;

  constructor(
    status: number,
    statusText: string,
    version: HTTPVersion,
    headers: Map<string, string>,
    body: any
  ) {
    this.constants = new Constants();
    this.status = status;
    this.statusText = statusText;
    this.version = version;
    this.headers = headers;
    this.body = body;
    this.chunked = false;
    this.compressed = false;
    this.encrypted = false;
    this.id = this.generateId();
    this.timestamp = Date.now();
    this.duration = 0;
    this.url = "";
    this.method = "";
    this.parseHeaders();
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  private parseHeaders(): void {
    for (const [key, value] of this.headers) {
      const lowerKey = key.toLowerCase();
      if (lowerKey === "transfer-encoding" && value === "chunked") {
        this.chunked = true;
      }
      if (lowerKey === "content-encoding" && value.includes("gzip")) {
        this.compressed = true;
      }
      if (lowerKey === "encryption") {
        this.encrypted = true;
      }
    }
  }

  public getStatus(): number {
    return this.status;
  }

  public getStatusText(): string {
    return this.statusText;
  }

  public getVersion(): HTTPVersion {
    return this.version;
  }

  public getHeaders(): Map<string, string> {
    return this.headers;
  }

  public getHeader(name: string): string | undefined {
    return this.headers.get(name);
  }

  public getBody(): any {
    return this.body;
  }

  public getChunked(): boolean {
    return this.chunked;
  }

  public getCompressed(): boolean {
    return this.compressed;
  }

  public getEncrypted(): boolean {
    return this.encrypted;
  }

  public getId(): string {
    return this.id;
  }

  public getTimestamp(): number {
    return this.timestamp;
  }

  public getDuration(): number {
    return this.duration;
  }

  public setDuration(duration: number): void {
    this.duration = duration;
  }

  public getURL(): string {
    return this.url;
  }

  public setURL(url: string): void {
    this.url = url;
  }

  public getMethod(): string {
    return this.method;
  }

  public setMethod(method: string): void {
    this.method = method;
  }

  public isSuccess(): boolean {
    return this.status >= 200 && this.status < 300;
  }

  public isRedirect(): boolean {
    return this.status >= 300 && this.status < 400;
  }

  public isError(): boolean {
    return this.status >= 400;
  }

  public isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  public isServerError(): boolean {
    return this.status >= 500;
  }

  public isInformational(): boolean {
    return this.status >= 100 && this.status < 200;
  }

  public getBodyAsString(): string {
    if (typeof this.body === "string") {
      return this.body;
    }
    if (Buffer.isBuffer(this.body)) {
      return this.body.toString();
    }
    if (typeof this.body === "object") {
      return JSON.stringify(this.body);
    }
    return String(this.body);
  }

  public getBodyAsJSON(): any {
    if (typeof this.body === "object") {
      return this.body;
    }
    if (typeof this.body === "string") {
      try {
        return JSON.parse(this.body);
      } catch {
        return null;
      }
    }
    return null;
  }

  public getBodyAsBuffer(): Buffer {
    if (Buffer.isBuffer(this.body)) {
      return this.body;
    }
    if (typeof this.body === "string") {
      return Buffer.from(this.body);
    }
    if (typeof this.body === "object") {
      return Buffer.from(JSON.stringify(this.body));
    }
    return Buffer.from(String(this.body));
  }

  public getContentLength(): number {
    const length = this.headers.get("content-length");
    return length ? parseInt(length, 10) : 0;
  }

  public getContentType(): string {
    return this.headers.get("content-type") || "";
  }

  public getCacheControl(): string {
    return this.headers.get("cache-control") || "";
  }

  public getETag(): string {
    return this.headers.get("etag") || "";
  }

  public getLastModified(): string {
    return this.headers.get("last-modified") || "";
  }

  public getLocation(): string {
    return this.headers.get("location") || "";
  }

  public getSetCookie(): string[] {
    const cookies = this.headers.get("set-cookie");
    return cookies ? cookies.split(",").map(c => c.trim()) : [];
  }

  public toBuffer(): Buffer {
    let statusLine = `${this.version} ${this.status} ${this.statusText}\r\n`;
    let headerString = "";
    for (const [key, value] of this.headers) {
      headerString += `${key}: ${value}\r\n`;
    }
    let bodyString = "";
    if (this.body) {
      if (typeof this.body === "string") {
        bodyString = this.body;
      } else if (Buffer.isBuffer(this.body)) {
        bodyString = this.body.toString();
      } else {
        bodyString = JSON.stringify(this.body);
      }
    }
    const fullResponse = `${statusLine}${headerString}\r\n${bodyString}`;
    return Buffer.from(fullResponse);
  }

  public clone(): CTTPResponse {
    const clone = new CTTPResponse(
      this.status,
      this.statusText,
      this.version,
      new Map(this.headers),
      this.body
    );
    clone.chunked = this.chunked;
    clone.compressed = this.compressed;
    clone.encrypted = this.encrypted;
    clone.id = this.id;
    clone.timestamp = this.timestamp;
    clone.duration = this.duration;
    clone.url = this.url;
    clone.method = this.method;
    return clone;
  }
}