import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { HTTPMethod } from "./HTTPMethod";
import { HTTPVersion } from "./HTTPVersion";
import { HeaderBuilder } from "../utils/HeaderBuilder";
import { URLParser } from "../utils/URLParser";
import { QueryBuilder } from "../utils/QueryBuilder";
import { RequestTypes } from "../types/RequestTypes";
import { Constants } from "./Constants";

export class CTTPRequest implements IHTTPRequest {
  private method: HTTPMethod;
  private url: string;
  private headers: Map<string, string>;
  private body: any;
  private timeout: number;
  private version: HTTPVersion;
  private tunnel: boolean;
  private query: Map<string, string>;
  private path: string;
  private host: string;
  private port: number;
  private protocol: string;
  private chunked: boolean;
  private priority: number;
  private id: string;
  private timestamp: number;
  private retries: number;
  private compress: boolean;
  private encrypt: boolean;
  private credentials: any;
  private cookieJar: any;
  private cacheControl: string;
  private etag: string;
  private ifMatch: string;
  private ifNoneMatch: string;
  private range: string;
  private contentLength: number;
  private contentType: string;
  private accept: string;
  private acceptEncoding: string;
  private acceptLanguage: string;
  private userAgent: string;
  private referer: string;
  private origin: string;
  private authorization: string;
  private connection: string;
  private upgrade: string;
  private constants: Constants;

  constructor(method: HTTPMethod, url: string, options?: any) {
    this.constants = new Constants();
    this.method = method;
    this.url = url;
    this.headers = new Map();
    this.query = new Map();
    this.timeout = 30000;
    this.version = HTTPVersion.HTTP_1_1;
    this.tunnel = false;
    this.chunked = false;
    this.priority = 0;
    this.id = this.generateId();
    this.timestamp = Date.now();
    this.retries = 0;
    this.compress = false;
    this.encrypt = false;
    this.contentLength = 0;
    this.contentType = "application/json";
    this.accept = "*/*";
    this.acceptEncoding = "gzip, deflate, br";
    this.acceptLanguage = "en-US,en;q=0.9";
    this.userAgent = "CTTP/1.0";
    this.connection = "keep-alive";
    
    if (options) {
      this.applyOptions(options);
    }
    
    this.parseURL(url);
    this.buildHeaders();
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  private applyOptions(options: any): void {
    if (options.headers) {
      for (const [key, value] of Object.entries(options.headers)) {
        this.headers.set(key, value as string);
      }
    }
    if (options.query) {
      for (const [key, value] of Object.entries(options.query)) {
        this.query.set(key, value as string);
      }
    }
    if (options.body !== undefined) {
      this.body = options.body;
    }
    if (options.timeout !== undefined) {
      this.timeout = options.timeout;
    }
    if (options.version !== undefined) {
      this.version = options.version;
    }
    if (options.tunnel !== undefined) {
      this.tunnel = options.tunnel;
    }
    if (options.chunked !== undefined) {
      this.chunked = options.chunked;
    }
    if (options.priority !== undefined) {
      this.priority = options.priority;
    }
    if (options.retries !== undefined) {
      this.retries = options.retries;
    }
    if (options.compress !== undefined) {
      this.compress = options.compress;
    }
    if (options.encrypt !== undefined) {
      this.encrypt = options.encrypt;
    }
    if (options.credentials !== undefined) {
      this.credentials = options.credentials;
    }
    if (options.cookieJar !== undefined) {
      this.cookieJar = options.cookieJar;
    }
    if (options.cacheControl !== undefined) {
      this.cacheControl = options.cacheControl;
    }
    if (options.etag !== undefined) {
      this.etag = options.etag;
    }
    if (options.ifMatch !== undefined) {
      this.ifMatch = options.ifMatch;
    }
    if (options.ifNoneMatch !== undefined) {
      this.ifNoneMatch = options.ifNoneMatch;
    }
    if (options.range !== undefined) {
      this.range = options.range;
    }
    if (options.contentType !== undefined) {
      this.contentType = options.contentType;
    }
    if (options.accept !== undefined) {
      this.accept = options.accept;
    }
    if (options.acceptEncoding !== undefined) {
      this.acceptEncoding = options.acceptEncoding;
    }
    if (options.acceptLanguage !== undefined) {
      this.acceptLanguage = options.acceptLanguage;
    }
    if (options.userAgent !== undefined) {
      this.userAgent = options.userAgent;
    }
    if (options.referer !== undefined) {
      this.referer = options.referer;
    }
    if (options.origin !== undefined) {
      this.origin = options.origin;
    }
    if (options.authorization !== undefined) {
      this.authorization = options.authorization;
    }
    if (options.connection !== undefined) {
      this.connection = options.connection;
    }
    if (options.upgrade !== undefined) {
      this.upgrade = options.upgrade;
    }
  }

  private parseURL(url: string): void {
    const parsed = URLParser.parse(url);
    this.protocol = parsed.protocol || "https";
    this.host = parsed.hostname || "";
    this.port = parsed.port || (this.protocol === "https" ? 443 : 80);
    this.path = parsed.pathname || "/";
    if (parsed.query) {
      for (const [key, value] of Object.entries(parsed.query)) {
        this.query.set(key, value as string);
      }
    }
  }

  private buildHeaders(): void {
    const builder = new HeaderBuilder();
    builder.add("Host", this.host);
    builder.add("User-Agent", this.userAgent);
    builder.add("Accept", this.accept);
    builder.add("Accept-Encoding", this.acceptEncoding);
    builder.add("Accept-Language", this.acceptLanguage);
    builder.add("Connection", this.connection);
    builder.add("Content-Type", this.contentType);
    if (this.cacheControl) {
      builder.add("Cache-Control", this.cacheControl);
    }
    if (this.etag) {
      builder.add("ETag", this.etag);
    }
    if (this.ifMatch) {
      builder.add("If-Match", this.ifMatch);
    }
    if (this.ifNoneMatch) {
      builder.add("If-None-Match", this.ifNoneMatch);
    }
    if (this.range) {
      builder.add("Range", this.range);
    }
    if (this.referer) {
      builder.add("Referer", this.referer);
    }
    if (this.origin) {
      builder.add("Origin", this.origin);
    }
    if (this.authorization) {
      builder.add("Authorization", this.authorization);
    }
    if (this.upgrade) {
      builder.add("Upgrade", this.upgrade);
    }
    if (this.chunked) {
      builder.add("Transfer-Encoding", "chunked");
    }
    if (this.compress) {
      builder.add("Content-Encoding", "gzip");
    }
    if (this.encrypt) {
      builder.add("Encryption", "AES-256-GCM");
    }
    for (const [key, value] of this.headers) {
      builder.add(key, value);
    }
    this.headers = builder.build();
  }

  public getMethod(): HTTPMethod {
    return this.method;
  }

  public setMethod(method: HTTPMethod): void {
    this.method = method;
  }

  public getURL(): string {
    const queryString = QueryBuilder.build(this.query);
    return `${this.protocol}://${this.host}:${this.port}${this.path}${queryString}`;
  }

  public getHeaders(): Map<string, string> {
    return this.headers;
  }

  public setHeaders(headers: Map<string, string>): void {
    this.headers = headers;
  }

  public getBody(): any {
    return this.body;
  }

  public setBody(body: any): void {
    this.body = body;
  }

  public getTimeout(): number {
    return this.timeout;
  }

  public setTimeout(timeout: number): void {
    this.timeout = timeout;
  }

  public getVersion(): HTTPVersion {
    return this.version;
  }

  public setVersion(version: HTTPVersion): void {
    this.version = version;
  }

  public getTunnel(): boolean {
    return this.tunnel;
  }

  public setTunnel(tunnel: boolean): void {
    this.tunnel = tunnel;
  }

  public getQuery(): Map<string, string> {
    return this.query;
  }

  public setQuery(query: Map<string, string>): void {
    this.query = query;
  }

  public getPath(): string {
    return this.path;
  }

  public getHost(): string {
    return this.host;
  }

  public getPort(): number {
    return this.port;
  }

  public getProtocol(): string {
    return this.protocol;
  }

  public getChunked(): boolean {
    return this.chunked;
  }

  public getPriority(): number {
    return this.priority;
  }

  public getId(): string {
    return this.id;
  }

  public getTimestamp(): number {
    return this.timestamp;
  }

  public getRetries(): number {
    return this.retries;
  }

  public incrementRetries(): void {
    this.retries++;
  }

  public getCompress(): boolean {
    return this.compress;
  }

  public getEncrypt(): boolean {
    return this.encrypt;
  }

  public getCredentials(): any {
    return this.credentials;
  }

  public getCookieJar(): any {
    return this.cookieJar;
  }

  public getCacheControl(): string {
    return this.cacheControl;
  }

  public getETag(): string {
    return this.etag;
  }

  public getIfMatch(): string {
    return this.ifMatch;
  }

  public getIfNoneMatch(): string {
    return this.ifNoneMatch;
  }

  public getRange(): string {
    return this.range;
  }

  public getContentLength(): number {
    return this.contentLength;
  }

  public getContentType(): string {
    return this.contentType;
  }

  public getAccept(): string {
    return this.accept;
  }

  public getAcceptEncoding(): string {
    return this.acceptEncoding;
  }

  public getAcceptLanguage(): string {
    return this.acceptLanguage;
  }

  public getUserAgent(): string {
    return this.userAgent;
  }

  public getReferer(): string {
    return this.referer;
  }

  public getOrigin(): string {
    return this.origin;
  }

  public getAuthorization(): string {
    return this.authorization;
  }

  public getConnection(): string {
    return this.connection;
  }

  public getUpgrade(): string {
    return this.upgrade;
  }

  public toBuffer(): Buffer {
    let requestLine = `${this.method} ${this.path} ${this.version}\r\n`;
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
    const fullRequest = `${requestLine}${headerString}\r\n${bodyString}`;
    return Buffer.from(fullRequest);
  }

  public clone(): CTTPRequest {
    const clone = new CTTPRequest(this.method, this.url);
    clone.headers = new Map(this.headers);
    clone.body = this.body;
    clone.timeout = this.timeout;
    clone.version = this.version;
    clone.tunnel = this.tunnel;
    clone.query = new Map(this.query);
    clone.path = this.path;
    clone.host = this.host;
    clone.port = this.port;
    clone.protocol = this.protocol;
    clone.chunked = this.chunked;
    clone.priority = this.priority;
    clone.id = this.id;
    clone.timestamp = this.timestamp;
    clone.retries = this.retries;
    clone.compress = this.compress;
    clone.encrypt = this.encrypt;
    clone.credentials = this.credentials;
    clone.cookieJar = this.cookieJar;
    clone.cacheControl = this.cacheControl;
    clone.etag = this.etag;
    clone.ifMatch = this.ifMatch;
    clone.ifNoneMatch = this.ifNoneMatch;
    clone.range = this.range;
    clone.contentLength = this.contentLength;
    clone.contentType = this.contentType;
    clone.accept = this.accept;
    clone.acceptEncoding = this.acceptEncoding;
    clone.acceptLanguage = this.acceptLanguage;
    clone.userAgent = this.userAgent;
    clone.referer = this.referer;
    clone.origin = this.origin;
    clone.authorization = this.authorization;
    clone.connection = this.connection;
    clone.upgrade = this.upgrade;
    return clone;
  }
}