export class HexEncoder {
  public encode(data: Buffer): string {
    return data.toString("hex");
  }

  public decode(data: string): Buffer {
    return Buffer.from(data, "hex");
  }

  public encodeUtf8(text: string): string {
    return this.encode(Buffer.from(text, "utf8"));
  }

  public decodeUtf8(data: string): string {
    return this.decode(data).toString("utf8");
  }

  public isHex(str: string): boolean {
    return /^[0-9a-fA-F]+$/.test(str) && str.length % 2 === 0;
  }

  public toByteArray(str: string): number[] {
    const bytes: number[] = [];
    for (let i = 0; i < str.length; i += 2) {
      bytes.push(parseInt(str.substr(i, 2), 16));
    }
    return bytes;
  }

  public fromByteArray(bytes: number[]): string {
    return bytes.map(b => b.toString(16).padStart(2, "0")).join("");
  }
}