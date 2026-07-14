"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrameBuilder = void 0;
class FrameBuilder {
    constructor() {
        this.frameTypes = new Map([
            [0, "data"],
            [1, "headers"],
            [2, "priority"],
            [3, "rst_stream"],
            [4, "settings"],
            [5, "push_promise"],
            [6, "ping"],
            [7, "goaway"],
            [8, "window_update"],
            [9, "continuation"]
        ]);
    }
    buildHeaders(streamId, headers, endStream) {
        const flags = endStream ? 0x01 : 0x00;
        const length = headers.length;
        const frame = Buffer.alloc(9 + length);
        frame.writeUInt32BE((length << 8) | 0x01, 0);
        frame.writeUInt32BE(0x00, 4);
        frame.writeUInt32BE(streamId, 5);
        headers.copy(frame, 9);
        return frame;
    }
    buildData(streamId, data, endStream) {
        const flags = endStream ? 0x01 : 0x00;
        const length = data.length;
        const frame = Buffer.alloc(9 + length);
        frame.writeUInt32BE((length << 8) | 0x00, 0);
        frame.writeUInt32BE(0x00, 4);
        frame.writeUInt32BE(streamId, 5);
        data.copy(frame, 9);
        return frame;
    }
    buildSettings(settings) {
        const entries = Array.from(settings.entries());
        const length = entries.length * 6;
        const frame = Buffer.alloc(9 + length);
        frame.writeUInt32BE((length << 8) | 0x04, 0);
        frame.writeUInt32BE(0x00, 4);
        frame.writeUInt32BE(0x00, 5);
        let offset = 9;
        for (const [id, value] of entries) {
            frame.writeUInt16BE(id, offset);
            frame.writeUInt32BE(value, offset + 2);
            offset += 6;
        }
        return frame;
    }
    buildPing(data, ack = false) {
        const flags = ack ? 0x01 : 0x00;
        const frame = Buffer.alloc(17);
        frame.writeUInt32BE((8 << 8) | 0x06, 0);
        frame.writeUInt32BE(flags, 4);
        frame.writeUInt32BE(0x00, 5);
        data.copy(frame, 9);
        return frame;
    }
    buildGoAway(lastStreamId, errorCode) {
        const frame = Buffer.alloc(17);
        frame.writeUInt32BE((8 << 8) | 0x07, 0);
        frame.writeUInt32BE(0x00, 4);
        frame.writeUInt32BE(0x00, 5);
        frame.writeUInt32BE(lastStreamId, 9);
        frame.writeUInt32BE(errorCode, 13);
        return frame;
    }
    buildWindowUpdate(streamId, increment) {
        const frame = Buffer.alloc(13);
        frame.writeUInt32BE((4 << 8) | 0x08, 0);
        frame.writeUInt32BE(0x00, 4);
        frame.writeUInt32BE(streamId, 5);
        frame.writeUInt32BE(increment, 9);
        return frame;
    }
    buildRstStream(streamId, errorCode) {
        const frame = Buffer.alloc(13);
        frame.writeUInt32BE((4 << 8) | 0x03, 0);
        frame.writeUInt32BE(0x00, 4);
        frame.writeUInt32BE(streamId, 5);
        frame.writeUInt32BE(errorCode, 9);
        return frame;
    }
    parse(data) {
        const frames = [];
        let offset = 0;
        while (offset + 9 <= data.length) {
            const length = (data[offset] << 16) | (data[offset + 1] << 8) | data[offset + 2];
            const type = data[offset + 3];
            const flags = data[offset + 4];
            const streamId = data.readUInt32BE(offset + 5) & 0x7fffffff;
            const payload = data.subarray(offset + 9, offset + 9 + length);
            const frame = {
                type: this.frameTypes.get(type) || "unknown",
                typeCode: type,
                flags,
                streamId,
                payload
            };
            frames.push(frame);
            offset += 9 + length;
        }
        return frames;
    }
    getFrameType(code) {
        return this.frameTypes.get(code) || "unknown";
    }
    getFrameCode(type) {
        for (const [code, name] of this.frameTypes) {
            if (name === type) {
                return code;
            }
        }
        return -1;
    }
}
exports.FrameBuilder = FrameBuilder;
//# sourceMappingURL=FrameBuilder.js.map