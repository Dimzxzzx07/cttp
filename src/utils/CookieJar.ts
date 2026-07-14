export class CookieJar {
  private cookies: Map<string, any>;
  private domain: string;
  private path: string;

  constructor(domain?: string, path?: string) {
    this.cookies = new Map();
    this.domain = domain || "";
    this.path = path || "/";
  }

  public set(name: string, value: string, options?: any): void {
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

  public get(name: string): string | undefined {
    const cookie = this.cookies.get(name);
    return cookie ? cookie.value : undefined;
  }

  public remove(name: string): void {
    this.cookies.delete(name);
  }

  public getAll(): Map<string, any> {
    return new Map(this.cookies);
  }

  public clear(): void {
    this.cookies.clear();
  }

  public parseSetCookie(header: string): void {
    const parts = header.split(";").map(p => p.trim());
    const [nameValue, ...attributes] = parts;

    const [name, value] = nameValue.split("=");
    if (!name) return;

    const options: any = {};

    for (const attr of attributes) {
      const [key, val] = attr.split("=");
      const k = key.toLowerCase();
      if (k === "domain") {
        options.domain = val;
      } else if (k === "path") {
        options.path = val;
      } else if (k === "expires") {
        options.expires = new Date(val);
      } else if (k === "max-age") {
        options.maxAge = parseInt(val, 10);
      } else if (k === "secure") {
        options.secure = true;
      } else if (k === "httponly") {
        options.httpOnly = true;
      } else if (k === "samesite") {
        options.sameSite = val;
      }
    }

    this.set(name, value, options);
  }

  public toString(): string {
    const parts: string[] = [];
    for (const [name, cookie] of this.cookies) {
      parts.push(`${name}=${cookie.value}`);
    }
    return parts.join("; ");
  }

  public toHeader(): string {
    return this.toString();
  }

  public getExpired(): string[] {
    const expired: string[] = [];
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

  public cleanExpired(): void {
    const expired = this.getExpired();
    for (const name of expired) {
      this.remove(name);
    }
  }
}