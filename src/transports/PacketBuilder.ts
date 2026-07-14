export class PacketBuilder {
  private magic: number;
  private version: number;

  constructor() {
    this.magic = 0x43545450;
    this.version = 1;
  }

  public build(data: Buffer, type: number, flags: number): Buffer {
    const header = Buffer.alloc(16);
    header.writeUInt32BE(this.magic, 0);
    header.writeUInt16BE(this.version, 4);
    header.writeUInt16BE(type, 6);
    header.writeUInt16BE(flags, 8);
    header.writeUInt32BE(data.length, 12);
    return Buffer.concat([header, data]);
  }

  public buildAck(sequence: number): Buffer {
    const data = Buffer.alloc(4);
    data.writeUInt32BE(sequence, 0);
    return this.build(data, 2, 0);
  }

  public buildRst(sequence: number): Buffer {
    const data = Buffer.alloc(4);
    data.writeUInt32BE(sequence, 0);
    return this.build(data, 3, 0);
  }

  public buildPing(): Buffer {
    return this.build(Buffer.alloc(0), 1, 0);
  }

  public buildPong(): Buffer {
    return this.build(Buffer.alloc(0), 4, 0);
  }

  public getMagic(): number {
    return this.magic;
  }

  public getVersion(): number {
    return this.version;
  }
}