/// <reference types="node" />
/// <reference types="node" />
import { HTTPMethod } from "../core/HTTPMethod";
import { HTTPVersion } from "../core/HTTPVersion";
export interface IHTTPRequest {
    getMethod(): HTTPMethod;
    setMethod(method: HTTPMethod): void;
    getURL(): string;
    getHeaders(): Map<string, string>;
    setHeaders(headers: Map<string, string>): void;
    getBody(): any;
    setBody(body: any): void;
    getTimeout(): number;
    setTimeout(timeout: number): void;
    getVersion(): HTTPVersion;
    setVersion(version: HTTPVersion): void;
    getTunnel(): boolean;
    setTunnel(tunnel: boolean): void;
    getQuery(): Map<string, string>;
    setQuery(query: Map<string, string>): void;
    getPath(): string;
    getHost(): string;
    getPort(): number;
    getProtocol(): string;
    getChunked(): boolean;
    getPriority(): number;
    getId(): string;
    getTimestamp(): number;
    getRetries(): number;
    incrementRetries(): void;
    getCompress(): boolean;
    getEncrypt(): boolean;
    getCredentials(): any;
    getCookieJar(): any;
    getCacheControl(): string;
    getETag(): string;
    getIfMatch(): string;
    getIfNoneMatch(): string;
    getRange(): string;
    getContentLength(): number;
    getContentType(): string;
    getAccept(): string;
    getAcceptEncoding(): string;
    getAcceptLanguage(): string;
    getUserAgent(): string;
    getReferer(): string;
    getOrigin(): string;
    getAuthorization(): string;
    getConnection(): string;
    getUpgrade(): string;
    toBuffer(): Buffer;
    clone(): IHTTPRequest;
}
//# sourceMappingURL=IHTTPRequest.d.ts.map