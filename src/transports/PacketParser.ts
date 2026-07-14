export class PacketParser {
  private magic: number;
  private version: number;

  constructor() {
    this.magic = 0x43545450;
    this.version = 1;
  }

  public parse(buffer: Buffer): any {
    if (buffer.length < 16) {
      return null;
    }

    const magic = buffer.readUInt32BE(0);
    if (magic !== this.magic) {
      return null;
    }

    const version = buffer.readUInt16BE(4);
    if (version !== this.version) {
      return null;
    }

    const type = buffer.readUInt16BE(6);
    const flags = buffer.readUInt16BE(8);
    const length = buffer.readUInt32BE(12);

    if (buffer.length < 16 + length) {
      return null;
    }

    const data = buffer.subarray(16, 16 + length);

    return {
      magic,
      version,
      type,
      flags,
      length,
      data
    };
  }

  public parseData(packet: any): Buffer {
    return packet.data;
  }

  public parseAck(packet: any): number {
    return packet.data.readUInt32BE(0);
  }

  public parseRst(packet: any): number {
    return packet.data.readUInt32BE(0);
  }

  public isPing(packet: any): boolean {
    return packet.type === 1;
  }

  public isPong(packet: any): boolean {
    return packet.type === 4;
  }

  public isAck(packet: any): boolean {
    return packet.type === 2;
  }

  public isRst(packet: any): boolean {
    return packet.type === 3;
  }

  public getMagic(): number {
    return this.magic;
  }

  public getVersion(): number {
    return this.version;
  }
}