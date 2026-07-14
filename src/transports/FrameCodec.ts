export class FrameCodec {
  private maxFrameSize: number;

  constructor(maxFrameSize?: number) {
    this.maxFrameSize = maxFrameSize || 16384;
  }

  public encode(data: Buffer, type: number, flags: number, streamId: number): Buffer {
    const length = data.length;
    const frame = Buffer.alloc(9 + length);
    frame[0] = (length >> 16) & 0xff;
    frame[1] = (length >> 8) & 0xff;
    frame[2] = length & 0xff;
    frame[3] = type;
    frame[4] = flags;
    frame.writeUInt32BE(streamId, 5);
    data.copy(frame, 9);
    return frame;
  }

  public decode(buffer: Buffer): any[] {
    const frames: any[] = [];
    let offset = 0;

    while (offset + 9 <= buffer.length) {
      const length = (buffer[offset] << 16) | (buffer[offset + 1] << 8) | buffer[offset + 2];
      const type = buffer[offset + 3];
      const flags = buffer[offset + 4];
      const streamId = buffer.readUInt32BE(offset + 5) & 0x7fffffff;

      if (offset + 9 + length > buffer.length) {
        break;
      }

      const data = buffer.subarray(offset + 9, offset + 9 + length);
      frames.push({
        type,
        flags,
        streamId,
        data,
        length
      });

      offset += 9 + length;
    }

    return frames;
  }

  public encodeHeaders(streamId: number, headers: Buffer, endStream: boolean): Buffer {
    const flags = endStream ? 0x01 : 0x00;
    return this.encode(headers, 1, flags, streamId);
  }

  public encodeData(streamId: number, data: Buffer, endStream: boolean): Buffer {
    const flags = endStream ? 0x01 : 0x00;
    return this.encode(data, 0, flags, streamId);
  }

  public encodeSettings(settings: Map<number, number>): Buffer {
    const entries = Array.from(settings.entries());
    const length = entries.length * 6;
    const data = Buffer.alloc(length);
    let offset = 0;
    for (const [id, value] of entries) {
      data.writeUInt16BE(id, offset);
      data.writeUInt32BE(value, offset + 2);
      offset += 6;
    }
    return this.encode(data, 4, 0, 0);
  }

  public encodePing(data: Buffer, ack: boolean): Buffer {
    const flags = ack ? 0x01 : 0x00;
    return this.encode(data, 6, flags, 0);
  }

  public encodeGoAway(lastStreamId: number, errorCode: number): Buffer {
    const data = Buffer.alloc(8);
    data.writeUInt32BE(lastStreamId, 0);
    data.writeUInt32BE(errorCode, 4);
    return this.encode(data, 7, 0, 0);
  }

  public encodeWindowUpdate(streamId: number, increment: number): Buffer {
    const data = Buffer.alloc(4);
    data.writeUInt32BE(increment, 0);
    return this.encode(data, 8, 0, streamId);
  }

  public getMaxFrameSize(): number {
    return this.maxFrameSize;
  }

  public setMaxFrameSize(size: number): void {
    this.maxFrameSize = Math.min(size, 16777215);
  }
}