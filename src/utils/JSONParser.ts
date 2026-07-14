export class JSONParser {
  public parse(data: string): any {
    return JSON.parse(data);
  }

  public stringify(data: any, pretty?: boolean): string {
    if (pretty) {
      return JSON.stringify(data, null, 2);
    }
    return JSON.stringify(data);
  }

  public parseStream(data: Buffer): any {
    return this.parse(data.toString("utf8"));
  }

  public stringifyStream(data: any, pretty?: boolean): Buffer {
    return Buffer.from(this.stringify(data, pretty), "utf8");
  }

  public isValid(data: string): boolean {
    try {
      JSON.parse(data);
      return true;
    } catch {
      return false;
    }
  }

  public parseSafe(data: string, fallback?: any): any {
    try {
      return this.parse(data);
    } catch {
      return fallback || null;
    }
  }

  public stringifySafe(data: any, fallback?: string): string {
    try {
      return this.stringify(data);
    } catch {
      return fallback || "";
    }
  }

  public deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  public merge<T extends object, U extends object>(target: T, source: U): T & U {
    const result = { ...target, ...source };
    return result as T & U;
  }

  public deepMerge<T extends object, U extends object>(target: T, source: U): T & U {
    const result = { ...target } as any;
    for (const key of Object.keys(source) as (keyof U)[]) {
      const value = source[key];
      if (value && typeof value === "object" && !Array.isArray(value) && result[key] && typeof result[key] === "object") {
        result[key] = this.deepMerge(result[key], value);
      } else {
        result[key] = value;
      }
    }
    return result as T & U;
  }

  public flatten(obj: any, prefix?: string): Record<string, any> {
    const result: Record<string, any> = {};
    const pre = prefix || "";

    for (const key of Object.keys(obj)) {
      const value = obj[key];
      const newKey = pre ? `${pre}.${key}` : key;

      if (value && typeof value === "object" && !Array.isArray(value)) {
        Object.assign(result, this.flatten(value, newKey));
      } else {
        result[newKey] = value;
      }
    }

    return result;
  }

  public unflatten(obj: Record<string, any>): any {
    const result: any = {};

    for (const key of Object.keys(obj)) {
      const parts = key.split(".");
      let current = result;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          current[part] = obj[key];
        } else {
          current[part] = current[part] || {};
          current = current[part];
        }
      }
    }

    return result;
  }

  public pick(obj: any, keys: string[]): any {
    const result: any = {};
    for (const key of keys) {
      if (key in obj) {
        result[key] = obj[key];
      }
    }
    return result;
  }

  public omit(obj: any, keys: string[]): any {
    const result: any = {};
    for (const key of Object.keys(obj)) {
      if (!keys.includes(key)) {
        result[key] = obj[key];
      }
    }
    return result;
  }
}