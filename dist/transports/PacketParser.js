"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketParser = void 0;
class PacketParser {
    constructor() {
        this.magic = 0x43545450;
        this.version = 1;
    }
    parse(buffer) {
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
    parseData(packet) {
        return packet.data;
    }
    parseAck(packet) {
        return packet.data.readUInt32BE(0);
    }
    parseRst(packet) {
        return packet.data.readUInt32BE(0);
    }
    isPing(packet) {
        return packet.type === 1;
    }
    isPong(packet) {
        return packet.type === 4;
    }
    isAck(packet) {
        return packet.type === 2;
    }
    isRst(packet) {
        return packet.type === 3;
    }
    getMagic() {
        return this.magic;
    }
    getVersion() {
        return this.version;
    }
}
exports.PacketParser = PacketParser;
//# sourceMappingURL=PacketParser.js.map