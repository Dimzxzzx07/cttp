/// <reference types="node" />
/// <reference types="node" />
import { IConnection } from "../interfaces/IConnection";
export declare class TLSWrapper implements IConnection {
    private socket;
    private tlsSocket;
    private constants;
    private url;
    private connected;
    private readBuffer;
    constructor(host: string, port: number, options?: any);
    private createTLSSocket;
    getURL(): string;
    isAlive(): boolean;
    write(data: Buffer): Promise<void>;
    read(): Promise<Buffer>;
    close(): Promise<void>;
    getSocket(): any;
    getPeerCertificate(): any;
    getCipher(): any;
    getProtocol(): string;
    setSecureContext(options: any): void;
}
//# sourceMappingURL=TLSWrapper.d.ts.map