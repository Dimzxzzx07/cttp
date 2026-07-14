export declare class CookieJar {
    private cookies;
    private domain;
    private path;
    constructor(domain?: string, path?: string);
    set(name: string, value: string, options?: any): void;
    get(name: string): string | undefined;
    remove(name: string): void;
    getAll(): Map<string, any>;
    clear(): void;
    parseSetCookie(header: string): void;
    toString(): string;
    toHeader(): string;
    getExpired(): string[];
    cleanExpired(): void;
}
//# sourceMappingURL=CookieJar.d.ts.map