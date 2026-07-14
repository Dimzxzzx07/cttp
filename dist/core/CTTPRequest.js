"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CTTPRequest = void 0;
const HTTPVersion_1 = require("./HTTPVersion");
const HeaderBuilder_1 = require("../utils/HeaderBuilder");
const URLParser_1 = require("../utils/URLParser");
const QueryBuilder_1 = require("../utils/QueryBuilder");
const Constants_1 = require("./Constants");
class CTTPRequest {
    constructor(method, url, options) {
        this.constants = new Constants_1.Constants();
        this.method = method;
        this.url = url;
        this.headers = new Map();
        this.query = new Map();
        this.timeout = 30000;
        this.version = HTTPVersion_1.HTTPVersion.HTTP_1_1;
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
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
    applyOptions(options) {
        if (options.headers) {
            for (const [key, value] of Object.entries(options.headers)) {
                this.headers.set(key, value);
            }
        }
        if (options.query) {
            for (const [key, value] of Object.entries(options.query)) {
                this.query.set(key, value);
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
    parseURL(url) {
        const parsed = URLParser_1.URLParser.parse(url);
        this.protocol = parsed.protocol || "https";
        this.host = parsed.hostname || "";
        this.port = parsed.port || (this.protocol === "https" ? 443 : 80);
        this.path = parsed.pathname || "/";
        if (parsed.query) {
            for (const [key, value] of Object.entries(parsed.query)) {
                this.query.set(key, value);
            }
        }
    }
    buildHeaders() {
        const builder = new HeaderBuilder_1.HeaderBuilder();
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
    getMethod() {
        return this.method;
    }
    setMethod(method) {
        this.method = method;
    }
    getURL() {
        const queryString = QueryBuilder_1.QueryBuilder.build(this.query);
        return `${this.protocol}://${this.host}:${this.port}${this.path}${queryString}`;
    }
    getHeaders() {
        return this.headers;
    }
    setHeaders(headers) {
        this.headers = headers;
    }
    getBody() {
        return this.body;
    }
    setBody(body) {
        this.body = body;
    }
    getTimeout() {
        return this.timeout;
    }
    setTimeout(timeout) {
        this.timeout = timeout;
    }
    getVersion() {
        return this.version;
    }
    setVersion(version) {
        this.version = version;
    }
    getTunnel() {
        return this.tunnel;
    }
    setTunnel(tunnel) {
        this.tunnel = tunnel;
    }
    getQuery() {
        return this.query;
    }
    setQuery(query) {
        this.query = query;
    }
    getPath() {
        return this.path;
    }
    getHost() {
        return this.host;
    }
    getPort() {
        return this.port;
    }
    getProtocol() {
        return this.protocol;
    }
    getChunked() {
        return this.chunked;
    }
    getPriority() {
        return this.priority;
    }
    getId() {
        return this.id;
    }
    getTimestamp() {
        return this.timestamp;
    }
    getRetries() {
        return this.retries;
    }
    incrementRetries() {
        this.retries++;
    }
    getCompress() {
        return this.compress;
    }
    getEncrypt() {
        return this.encrypt;
    }
    getCredentials() {
        return this.credentials;
    }
    getCookieJar() {
        return this.cookieJar;
    }
    getCacheControl() {
        return this.cacheControl;
    }
    getETag() {
        return this.etag;
    }
    getIfMatch() {
        return this.ifMatch;
    }
    getIfNoneMatch() {
        return this.ifNoneMatch;
    }
    getRange() {
        return this.range;
    }
    getContentLength() {
        return this.contentLength;
    }
    getContentType() {
        return this.contentType;
    }
    getAccept() {
        return this.accept;
    }
    getAcceptEncoding() {
        return this.acceptEncoding;
    }
    getAcceptLanguage() {
        return this.acceptLanguage;
    }
    getUserAgent() {
        return this.userAgent;
    }
    getReferer() {
        return this.referer;
    }
    getOrigin() {
        return this.origin;
    }
    getAuthorization() {
        return this.authorization;
    }
    getConnection() {
        return this.connection;
    }
    getUpgrade() {
        return this.upgrade;
    }
    toBuffer() {
        let requestLine = `${this.method} ${this.path} ${this.version}\r\n`;
        let headerString = "";
        for (const [key, value] of this.headers) {
            headerString += `${key}: ${value}\r\n`;
        }
        let bodyString = "";
        if (this.body) {
            if (typeof this.body === "string") {
                bodyString = this.body;
            }
            else if (Buffer.isBuffer(this.body)) {
                bodyString = this.body.toString();
            }
            else {
                bodyString = JSON.stringify(this.body);
            }
        }
        const fullRequest = `${requestLine}${headerString}\r\n${bodyString}`;
        return Buffer.from(fullRequest);
    }
    clone() {
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
exports.CTTPRequest = CTTPRequest;
//# sourceMappingURL=CTTPRequest.js.map