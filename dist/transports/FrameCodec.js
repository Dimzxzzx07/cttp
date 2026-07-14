"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrameCodec = void 0;
class FrameCodec {
    constructor(maxFrameSize) {
        this.maxFrameSize = maxFrameSize || 16384;
    }
    encode(data, type, flags, streamId) {
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
    decode(buffer) {
        const frames = [];
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
    encodeHeaders(streamId, headers, endStream) {
        const flags = endStream ? 0x01 : 0x00;
        return this.encode(headers, 1, flags, streamId);
    }
    encodeData(streamId, data, endStream) {
        const flags = endStream ? 0x01 : 0x00;
        return this.encode(data, 0, flags, streamId);
    }
    encodeSettings(settings) {
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
    encodePing(data, ack) {
        const flags = ack ? 0x01 : 0x00;
        return this.encode(data, 6, flags, 0);
    }
    encodeGoAway(lastStreamId, errorCode) {
        const data = Buffer.alloc(8);
        data.writeUInt32BE(lastStreamId, 0);
        data.writeUInt32BE(errorCode, 4);
        return this.encode(data, 7, 0, 0);
    }
    encodeWindowUpdate(streamId, increment) {
        const data = Buffer.alloc(4);
        data.writeUInt32BE(increment, 0);
        return this.encode(data, 8, 0, streamId);
    }
    getMaxFrameSize() {
        return this.maxFrameSize;
    }
    setMaxFrameSize(size) {
        this.maxFrameSize = Math.min(size, 16777215);
    }
}
exports.FrameCodec = FrameCodec;
//# sourceMappingURL=FrameCodec.js.map