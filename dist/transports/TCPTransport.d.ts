/// <reference types="node" />
/// <reference types="node" />
import { IConnection } from "../interfaces/IConnection";
export declare class TCPTransport implements IConnection {
    private socket;
    private constants;
    private url;
    private connected;
    private readBuffer;
    private writeBuffer;
    constructor(host: string, port: number);
    private createSocket;
    getURL(): string;
    isAlive(): boolean;
    write(data: Buffer): Promise<void>;
    read(): Promise<Buffer>;
    close(): Promise<void>;
    getSocket(): any;
    setTimeout(timeout: number): void;
    getRemoteAddress(): string;
    getRemotePort(): number;
    getLocalAddress(): string;
    getLocalPort(): number;
}
//# sourceMappingURL=TCPTransport.d.ts.map