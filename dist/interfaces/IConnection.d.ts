/// <reference types="node" />
/// <reference types="node" />
export interface IConnection {
    getURL(): string;
    isAlive(): boolean;
    write(data: Buffer): Promise<void>;
    read(): Promise<Buffer>;
    close(): Promise<void>;
    getSocket(): any;
}
//# sourceMappingURL=IConnection.d.ts.map