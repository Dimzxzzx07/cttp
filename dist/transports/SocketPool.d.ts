export declare class SocketPool {
    private sockets;
    private maxSize;
    private idleTimeout;
    constructor(maxSize?: number, idleTimeout?: number);
    acquire(key: string): any | null;
    release(key: string, socket: any): void;
    remove(key: string, socket: any): void;
    createKey(host: string, port: number, protocol: string): string;
    private isAlive;
    private isExpired;
    private closeSocket;
    getSize(key: string): number;
    getTotalSize(): number;
    clear(): void;
    getKeys(): string[];
    setMaxSize(maxSize: number): void;
    getMaxSize(): number;
    setIdleTimeout(timeout: number): void;
    getIdleTimeout(): number;
    cleanup(): void;
}
//# sourceMappingURL=SocketPool.d.ts.map