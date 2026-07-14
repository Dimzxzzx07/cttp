export class FormDataParser {
  public parse(data: Buffer | string): Record<string, string> {
    const buffer = typeof data === "string" ? Buffer.from(data) : data;
    const text = buffer.toString("utf8");
    const pairs = text.split("&");
    const result: Record<string, string> = {};

    for (const pair of pairs) {
      const [key, value] = pair.split("=");
      if (key) {
        result[decodeURIComponent(key)] = value ? decodeURIComponent(value) : "";
      }
    }

    return result;
  }

  public stringify(data: Record<string, any>): string {
    const pairs: string[] = [];
    for (const key of Object.keys(data)) {
      const value = data[key];
      if (value === undefined || value === null) {
        continue;
      }
      if (Array.isArray(value)) {
        for (const item of value) {
          pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
        }
      } else {
        pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
      }
    }
    return pairs.join("&");
  }

  public parseStream(data: Buffer): Record<string, string> {
    return this.parse(data);
  }

  public stringifyStream(data: Record<string, any>): Buffer {
    return Buffer.from(this.stringify(data), "utf8");
  }

  public getValue(data: Record<string, string>, key: string): string | undefined {
    return data[key];
  }

  public getValues(data: Record<string, string>, key: string): string[] {
    const result: string[] = [];
    for (const k of Object.keys(data)) {
      if (k === key) {
        result.push(data[k]);
      }
    }
    return result;
  }

  public hasKey(data: Record<string, string>, key: string): boolean {
    return key in data;
  }

  public removeKey(data: Record<string, string>, key: string): void {
    delete data[key];
  }

  public merge(base: Record<string, string>, additional: Record<string, string>): Record<string, string> {
    return { ...base, ...additional };
  }

  public isFormData(data: any): boolean {
    return typeof data === "object" && data !== null && !Array.isArray(data) && typeof data.toString === "function";
  }
}