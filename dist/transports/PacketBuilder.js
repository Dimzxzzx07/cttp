"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketBuilder = void 0;
class PacketBuilder {
    constructor() {
        this.magic = 0x43545450;
        this.version = 1;
    }
    build(data, type, flags) {
        const header = Buffer.alloc(16);
        header.writeUInt32BE(this.magic, 0);
        header.writeUInt16BE(this.version, 4);
        header.writeUInt16BE(type, 6);
        header.writeUInt16BE(flags, 8);
        header.writeUInt32BE(data.length, 12);
        return Buffer.concat([header, data]);
    }
    buildAck(sequence) {
        const data = Buffer.alloc(4);
        data.writeUInt32BE(sequence, 0);
        return this.build(data, 2, 0);
    }
    buildRst(sequence) {
        const data = Buffer.alloc(4);
        data.writeUInt32BE(sequence, 0);
        return this.build(data, 3, 0);
    }
    buildPing() {
        return this.build(Buffer.alloc(0), 1, 0);
    }
    buildPong() {
        return this.build(Buffer.alloc(0), 4, 0);
    }
    getMagic() {
        return this.magic;
    }
    getVersion() {
        return this.version;
    }
}
exports.PacketBuilder = PacketBuilder;
//# sourceMappingURL=PacketBuilder.js.map