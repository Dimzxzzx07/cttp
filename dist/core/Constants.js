"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = void 0;
class Constants {
    constructor() {
        this.TUNNEL_MAGIC = 0x43545450;
        this.TUNNEL_VERSION = 1;
        this.DEFAULT_TIMEOUT = 30000;
        this.MAX_HEADER_SIZE = 8192;
        this.MAX_BODY_SIZE = 1024 * 1024 * 100;
        this.MAX_RETRIES = 3;
        this.MAX_REDIRECTS = 10;
        this.DEFAULT_CHUNK_SIZE = 1024 * 1024;
        this.DEFAULT_POOL_SIZE = 100;
        this.DEFAULT_CACHE_SIZE = 1000;
        this.DEFAULT_TTL = 300;
        this.HTTP_VERSION = "HTTP/1.1";
        this.HTTP2_VERSION = "HTTP/2";
        this.HTTP3_VERSION = "HTTP/3";
        this.QUIC_VERSION = "QUIC";
        this.USER_AGENT = "CTTP/1.0";
        this.CONTENT_TYPE_JSON = "application/json";
        this.CONTENT_TYPE_FORM = "application/x-www-form-urlencoded";
        this.CONTENT_TYPE_MULTIPART = "multipart/form-data";
        this.CONTENT_TYPE_OCTET = "application/octet-stream";
        this.ACCEPT_ALL = "*/*";
        this.ACCEPT_ENCODING = "gzip, deflate, br";
        this.ACCEPT_LANGUAGE = "en-US,en;q=0.9";
        this.CONNECTION_KEEP_ALIVE = "keep-alive";
        this.CONNECTION_CLOSE = "close";
        this.CACHE_CONTROL_NO_CACHE = "no-cache";
        this.CACHE_CONTROL_NO_STORE = "no-store";
        this.CACHE_CONTROL_MAX_AGE = "max-age=3600";
    }
}
exports.Constants = Constants;
//# sourceMappingURL=Constants.js.map