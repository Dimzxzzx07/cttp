export class QueryBuilder {
  public static build(params: Map<string, string>): string {
    if (!params || params.size === 0) {
      return "";
    }

    const parts: string[] = [];
    for (const [key, value] of params) {
      if (value !== undefined && value !== null) {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }
    }

    return parts.length > 0 ? `?${parts.join("&")}` : "";
  }

  public static parse(query: string): Map<string, string> {
    const result = new Map<string, string>();

    if (!query || !query.startsWith("?")) {
      return result;
    }

    const cleanQuery = query.substring(1);
    const pairs = cleanQuery.split("&");

    for (const pair of pairs) {
      const [key, value] = pair.split("=");
      if (key) {
        result.set(decodeURIComponent(key), value ? decodeURIComponent(value) : "");
      }
    }

    return result;
  }

  public static addParam(params: Map<string, string>, key: string, value: string): void {
    params.set(key, value);
  }

  public static removeParam(params: Map<string, string>, key: string): void {
    params.delete(key);
  }

  public static hasParam(params: Map<string, string>, key: string): boolean {
    return params.has(key);
  }

  public static getParam(params: Map<string, string>, key: string): string | undefined {
    return params.get(key);
  }

  public static encode(value: any): string {
    if (typeof value === "object") {
      return encodeURIComponent(JSON.stringify(value));
    }
    return encodeURIComponent(String(value));
  }

  public static decode(value: string): any {
    try {
      return JSON.parse(decodeURIComponent(value));
    } catch {
      return decodeURIComponent(value);
    }
  }
}