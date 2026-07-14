/// <reference types="node" />
/// <reference types="node" />
import { HTTPVersion } from "../core/HTTPVersion";
export interface IHTTPResponse {
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
    clone(): IHTTPResponse;
}
//# sourceMappingURL=IHTTPResponse.d.ts.map