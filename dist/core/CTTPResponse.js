"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CTTPResponse = void 0;
const Constants_1 = require("./Constants");
class CTTPResponse {
    constructor(status, statusText, version, headers, body) {
        this.constants = new Constants_1.Constants();
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
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
    parseHeaders() {
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
    getStatus() {
        return this.status;
    }
    getStatusText() {
        return this.statusText;
    }
    getVersion() {
        return this.version;
    }
    getHeaders() {
        return this.headers;
    }
    getHeader(name) {
        return this.headers.get(name);
    }
    getBody() {
        return this.body;
    }
    getChunked() {
        return this.chunked;
    }
    getCompressed() {
        return this.compressed;
    }
    getEncrypted() {
        return this.encrypted;
    }
    getId() {
        return this.id;
    }
    getTimestamp() {
        return this.timestamp;
    }
    getDuration() {
        return this.duration;
    }
    setDuration(duration) {
        this.duration = duration;
    }
    getURL() {
        return this.url;
    }
    setURL(url) {
        this.url = url;
    }
    getMethod() {
        return this.method;
    }
    setMethod(method) {
        this.method = method;
    }
    isSuccess() {
        return this.status >= 200 && this.status < 300;
    }
    isRedirect() {
        return this.status >= 300 && this.status < 400;
    }
    isError() {
        return this.status >= 400;
    }
    isClientError() {
        return this.status >= 400 && this.status < 500;
    }
    isServerError() {
        return this.status >= 500;
    }
    isInformational() {
        return this.status >= 100 && this.status < 200;
    }
    getBodyAsString() {
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
    getBodyAsJSON() {
        if (typeof this.body === "object") {
            return this.body;
        }
        if (typeof this.body === "string") {
            try {
                return JSON.parse(this.body);
            }
            catch {
                return null;
            }
        }
        return null;
    }
    getBodyAsBuffer() {
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
    getContentLength() {
        const length = this.headers.get("content-length");
        return length ? parseInt(length, 10) : 0;
    }
    getContentType() {
        return this.headers.get("content-type") || "";
    }
    getCacheControl() {
        return this.headers.get("cache-control") || "";
    }
    getETag() {
        return this.headers.get("etag") || "";
    }
    getLastModified() {
        return this.headers.get("last-modified") || "";
    }
    getLocation() {
        return this.headers.get("location") || "";
    }
    getSetCookie() {
        const cookies = this.headers.get("set-cookie");
        return cookies ? cookies.split(",").map(c => c.trim()) : [];
    }
    toBuffer() {
        let statusLine = `${this.version} ${this.status} ${this.statusText}\r\n`;
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
        const fullResponse = `${statusLine}${headerString}\r\n${bodyString}`;
        return Buffer.from(fullResponse);
    }
    clone() {
        const clone = new CTTPResponse(this.status, this.statusText, this.version, new Map(this.headers), this.body);
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
exports.CTTPResponse = CTTPResponse;
//# sourceMappingURL=CTTPResponse.js.map