export class QPACKEncoder {
  private staticTable: Map<string, number>;
  private dynamicTable: Map<string, string>;
  private maxTableSize: number;
  private maxBlockedStreams: number;

  constructor() {
    this.staticTable = new Map([
      [":authority", 0],
      [":method", 1],
      [":method-GET", 2],
      [":method-POST", 3],
      [":path", 4],
      [":path-/", 5],
      [":path-/index.html", 6],
      [":scheme", 7],
      [":scheme-http", 8],
      [":scheme-https", 9],
      [":status", 10],
      [":status-200", 11],
      [":status-204", 12],
      [":status-206", 13],
      [":status-304", 14],
      [":status-400", 15],
      [":status-404", 16],
      [":status-500", 17],
      ["accept-charset", 18],
      ["accept-encoding", 19],
      ["accept-language", 20],
      ["accept-ranges", 21],
      ["accept", 22],
      ["access-control-allow-origin", 23],
      ["age", 24],
      ["allow", 25],
      ["authorization", 26],
      ["cache-control", 27],
      ["content-disposition", 28],
      ["content-encoding", 29],
      ["content-language", 30],
      ["content-length", 31],
      ["content-location", 32],
      ["content-range", 33],
      ["content-type", 34],
      ["cookie", 35],
      ["date", 36],
      ["etag", 37],
      ["expect", 38],
      ["expires", 39],
      ["from", 40],
      ["host", 41],
      ["if-match", 42],
      ["if-modified-since", 43],
      ["if-none-match", 44],
      ["if-range", 45],
      ["if-unmodified-since", 46],
      ["last-modified", 47],
      ["link", 48],
      ["location", 49],
      ["max-forwards", 50],
      ["proxy-authenticate", 51],
      ["proxy-authorization", 52],
      ["range", 53],
      ["referer", 54],
      ["refresh", 55],
      ["retry-after", 56],
      ["server", 57],
      ["set-cookie", 58],
      ["strict-transport-security", 59],
      ["transfer-encoding", 60],
      ["user-agent", 61],
      ["vary", 62],
      ["via", 63],
      ["www-authenticate", 64]
    ]);
    this.dynamicTable = new Map();
    this.maxTableSize = 4096;
    this.maxBlockedStreams = 10;
  }

  public encode(headers: Map<string, string>): Buffer {
    const result: Buffer[] = [];
    for (const [key, value] of headers) {
      const staticIndex = this.getStaticIndex(key, value);
      if (staticIndex !== -1) {
        const indexBuffer = Buffer.alloc(2);
        indexBuffer.writeUInt16BE(staticIndex, 0);
        result.push(indexBuffer);
        continue;
      }
      const dynamicIndex = this.getDynamicIndex(key, value);
      if (dynamicIndex !== -1) {
        const indexBuffer = Buffer.alloc(2);
        indexBuffer.writeUInt16BE(0x80 | dynamicIndex, 0);
        result.push(indexBuffer);
        continue;
      }
      const keyBuffer = Buffer.from(key, "utf8");
      const valueBuffer = Buffer.from(value, "utf8");
      const length = keyBuffer.length + valueBuffer.length + 2;
      const buffer = Buffer.alloc(length);
      buffer[0] = 0x40;
      buffer[1] = keyBuffer.length;
      keyBuffer.copy(buffer, 2);
      buffer[2 + keyBuffer.length] = valueBuffer.length;
      valueBuffer.copy(buffer, 3 + keyBuffer.length);
      result.push(buffer);
      this.addToDynamicTable(key, value);
    }
    return Buffer.concat(result);
  }

  public decode(data: Buffer): Map<string, string> {
    const headers = new Map<string, string>();
    let offset = 0;
    while (offset < data.length) {
      const firstByte = data[offset];
      if ((firstByte & 0x80) === 0x80) {
        const index = firstByte & 0x7f;
        const [key, value] = this.getHeader(index);
        if (key) {
          headers.set(key, value || "");
        }
        offset += 1;
      } else if ((firstByte & 0x40) === 0x40) {
        const keyLength = data[offset + 1];
        const key = data.subarray(offset + 2, offset + 2 + keyLength).toString("utf8");
        const valueLength = data[offset + 2 + keyLength];
        const value = data.subarray(offset + 3 + keyLength, offset + 3 + keyLength + valueLength).toString("utf8");
        headers.set(key, value);
        this.addToDynamicTable(key, value);
        offset += 3 + keyLength + valueLength;
      } else if ((firstByte & 0x20) === 0x20) {
        const index = firstByte & 0x1f;
        offset += 1;
        const keyLength = data[offset];
        const key = data.subarray(offset + 1, offset + 1 + keyLength).toString("utf8");
        offset += 1 + keyLength;
        const valueLength = data[offset];
        const value = data.subarray(offset + 1, offset + 1 + valueLength).toString("utf8");
        headers.set(key, value);
        offset += 1 + valueLength;
      } else {
        const index = firstByte & 0x1f;
        const [key, value] = this.getHeader(index);
        if (key) {
          headers.set(key, value || "");
        }
        offset += 1;
      }
    }
    return headers;
  }

  private getStaticIndex(key: string, value: string): number {
    const fullKey = `${key}-${value}`;
    if (this.staticTable.has(fullKey)) {
      return this.staticTable.get(fullKey)!;
    }
    if (this.staticTable.has(key)) {
      return this.staticTable.get(key)!;
    }
    return -1;
  }

  private getDynamicIndex(key: string, value: string): number {
    let index = 1;
    for (const [k, v] of this.dynamicTable) {
      if (k === key && v === value) {
        return index;
      }
      index++;
    }
    return -1;
  }

  private getHeader(index: number): [string, string] {
    for (const [key, value] of this.staticTable) {
      if (value === index) {
        const parts = key.split("-");
        if (parts.length === 2) {
          return [parts[0], parts[1]];
        }
        return [key, ""];
      }
    }
    let dynamicIndex = index - this.staticTable.size;
    let count = 1;
    for (const [key, value] of this.dynamicTable) {
      if (count === dynamicIndex) {
        return [key, value];
      }
      count++;
    }
    return ["", ""];
  }

  private addToDynamicTable(key: string, value: string): void {
    const size = key.length + value.length + 32;
    while (this.dynamicTable.size * 32 + this.getDynamicSize() + size > this.maxTableSize) {
      const firstKey = this.dynamicTable.keys().next().value;
      if (firstKey) {
        this.dynamicTable.delete(firstKey);
      }
    }
    this.dynamicTable.set(key, value);
  }

  private getDynamicSize(): number {
    let size = 0;
    for (const [key, value] of this.dynamicTable) {
      size += key.length + value.length + 32;
    }
    return size;
  }

  public setMaxTableSize(size: number): void {
    this.maxTableSize = size;
  }

  public getMaxTableSize(): number {
    return this.maxTableSize;
  }

  public setMaxBlockedStreams(max: number): void {
    this.maxBlockedStreams = max;
  }

  public getMaxBlockedStreams(): number {
    return this.maxBlockedStreams;
  }

  public clearDynamicTable(): void {
    this.dynamicTable.clear();
  }
}