export class Base64Encoder {
  public encode(data: Buffer): string {
    return data.toString("base64");
  }

  public decode(data: string): Buffer {
    return Buffer.from(data, "base64");
  }

  public encodeURLSafe(data: Buffer): string {
    return data.toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  public decodeURLSafe(data: string): Buffer {
    let base64 = data.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    return Buffer.from(base64, "base64");
  }

  public encodeUtf8(text: string): string {
    return this.encode(Buffer.from(text, "utf8"));
  }

  public decodeUtf8(data: string): string {
    return this.decode(data).toString("utf8");
  }

  public isBase64(str: string): boolean {
    try {
      return Buffer.from(str, "base64").toString("base64") === str;
    } catch {
      return false;
    }
  }
}