import { ConfigTypes } from "../types/ConfigTypes";
export declare class DNSResolver {
    private config;
    private constants;
    private cache;
    private timerWheel;
    private ttl;
    private timeout;
    constructor(config: ConfigTypes.DNSConfig);
    resolve(hostname: string): Promise<string[]>;
    private lookup;
    resolveSRV(service: string, protocol: string, domain: string): Promise<any[]>;
    resolveTXT(domain: string): Promise<string[][]>;
    clearCache(): void;
    getCacheSize(): number;
}
//# sourceMappingURL=DNSResolver.d.ts.map