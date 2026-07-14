import { ConfigTypes } from "../types/ConfigTypes";
export declare class HealthChecker {
    private client;
    private bufferUtils;
    private cryptoUtils;
    private constants;
    private config;
    private healthStatus;
    private healthChecks;
    constructor(config: ConfigTypes.HealthConfig);
    private registerDefaultChecks;
    ping(url: string, options?: any): Promise<boolean>;
    healthCheck(url: string): Promise<any>;
    private checkConnection;
    private checkTLS;
    private checkDNS;
    private checkQUIC;
    registerCheck(name: string, check: Function): void;
    unregisterCheck(name: string): void;
    getHealthStatus(url: string): any;
    getAllHealthStatus(): Map<string, any>;
    clearHealthStatus(): void;
    close(): Promise<void>;
}
//# sourceMappingURL=HealthChecker.d.ts.map