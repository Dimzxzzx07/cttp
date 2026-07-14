/// <reference types="node" />
/// <reference types="node" />
export declare class PacketBuilder {
    private magic;
    private version;
    constructor();
    build(data: Buffer, type: number, flags: number): Buffer;
    buildAck(sequence: number): Buffer;
    buildRst(sequence: number): Buffer;
    buildPing(): Buffer;
    buildPong(): Buffer;
    getMagic(): number;
    getVersion(): number;
}
//# sourceMappingURL=PacketBuilder.d.ts.map