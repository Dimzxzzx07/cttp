/// <reference types="node" />
/// <reference types="node" />
export declare class PacketParser {
    private magic;
    private version;
    constructor();
    parse(buffer: Buffer): any;
    parseData(packet: any): Buffer;
    parseAck(packet: any): number;
    parseRst(packet: any): number;
    isPing(packet: any): boolean;
    isPong(packet: any): boolean;
    isAck(packet: any): boolean;
    isRst(packet: any): boolean;
    getMagic(): number;
    getVersion(): number;
}
//# sourceMappingURL=PacketParser.d.ts.map