/// <reference types="node" />
/// <reference types="node" />
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
import { HTTPVersion } from "./HTTPVersion";
export declare class CTTPResponse implements IHTTPResponse {
    private status;
    private statusText;
    private version;
    private headers;
    private body;
    private chunked;
    private compressed;
    private encrypted;
    private id;
    private timestamp;
    private duration;
    private url;
    private method;
    private constants;
    constructor(status: number, statusText: string, version: HTTPVersion, headers: Map<string, string>, body: any);
    private generateId;
    private parseHeaders;
    getStatus(): number;
    getStatusText(): string;
    getVersion(): HTTPVersion;
    getHeaders(): Map<string, string>;
    getHeader(name: string): string | undefined;
    getBody(): any;
    getChunked(): boolean;
    getCompressed(): boolean;
    getEncrypted(): boolean;
    getId(): string;
    getTimestamp(): number;
    getDuration(): number;
    setDuration(duration: number): void;
    getURL(): string;
    setURL(url: string): void;
    getMethod(): string;
    setMethod(method: string): void;
    isSuccess(): boolean;
    isRedirect(): boolean;
    isError(): boolean;
    isClientError(): boolean;
    isServerError(): boolean;
    isInformational(): boolean;
    getBodyAsString(): string;
    getBodyAsJSON(): any;
    getBodyAsBuffer(): Buffer;
    getContentLength(): number;
    getContentType(): string;
    getCacheControl(): string;
    getETag(): string;
    getLastModified(): string;
    getLocation(): string;
    getSetCookie(): string[];
    toBuffer(): Buffer;
    clone(): CTTPResponse;
}
//# sourceMappingURL=CTTPResponse.d.ts.map