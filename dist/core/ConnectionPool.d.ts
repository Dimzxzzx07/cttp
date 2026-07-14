import { IConnection } from "../interfaces/IConnection";
import { ConfigTypes } from "../types/ConfigTypes";
export declare class ConnectionPool {
    private config;
    private constants;
    private connections;
    private activeConnections;
    private mutex;
    private timerWheel;
    private maxConnections;
    private idleTimeout;
    private connectionTimeout;
    constructor(config: ConfigTypes.PoolConfig);
    acquire(url: string): Promise<IConnection>;
    release(connection: IConnection): void;
    private getKey;
    private createConnection;
    private connect;
    private createConnectionObject;
    private evictIdle;
    close(): Promise<void>;
    getStats(): any;
}
//# sourceMappingURL=ConnectionPool.d.ts.map