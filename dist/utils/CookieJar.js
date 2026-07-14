"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieJar = void 0;
class CookieJar {
    constructor(domain, path) {
        this.cookies = new Map();
        this.domain = domain || "";
        this.path = path || "/";
    }
    set(name, value, options) {
        const cookie = {
            name,
            value,
            domain: options?.domain || this.domain,
            path: options?.path || this.path,
            expires: options?.expires || null,
            maxAge: options?.maxAge || null,
            secure: options?.secure || false,
            httpOnly: options?.httpOnly || false,
            sameSite: options?.sameSite || "Lax"
        };
        this.cookies.set(name, cookie);
    }
    get(name) {
        const cookie = this.cookies.get(name);
        return cookie ? cookie.value : undefined;
    }
    remove(name) {
        this.cookies.delete(name);
    }
    getAll() {
        return new Map(this.cookies);
    }
    clear() {
        this.cookies.clear();
    }
    parseSetCookie(header) {
        const parts = header.split(";").map(p => p.trim());
        const [nameValue, ...attributes] = parts;
        const [name, value] = nameValue.split("=");
        if (!name)
            return;
        const options = {};
        for (const attr of attributes) {
            const [key, val] = attr.split("=");
            const k = key.toLowerCase();
            if (k === "domain") {
                options.domain = val;
            }
            else if (k === "path") {
                options.path = val;
            }
            else if (k === "expires") {
                options.expires = new Date(val);
            }
            else if (k === "max-age") {
                options.maxAge = parseInt(val, 10);
            }
            else if (k === "secure") {
                options.secure = true;
            }
            else if (k === "httponly") {
                options.httpOnly = true;
            }
            else if (k === "samesite") {
                options.sameSite = val;
            }
        }
        this.set(name, value, options);
    }
    toString() {
        const parts = [];
        for (const [name, cookie] of this.cookies) {
            parts.push(`${name}=${cookie.value}`);
        }
        return parts.join("; ");
    }
    toHeader() {
        return this.toString();
    }
    getExpired() {
        const expired = [];
        const now = Date.now();
        for (const [name, cookie] of this.cookies) {
            if (cookie.expires && cookie.expires.getTime() < now) {
                expired.push(name);
            }
            if (cookie.maxAge && (Date.now() - cookie.createdAt) / 1000 > cookie.maxAge) {
                expired.push(name);
            }
        }
        return expired;
    }
    cleanExpired() {
        const expired = this.getExpired();
        for (const name of expired) {
            this.remove(name);
        }
    }
}
exports.CookieJar = CookieJar;
//# sourceMappingURL=CookieJar.js.map