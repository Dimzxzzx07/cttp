export declare class LoadBalancer {
    private endpoints;
    private currentIndex;
    private strategy;
    private weights;
    private healthStatus;
    constructor(strategy?: string);
    addEndpoint(url: string, weight?: number): void;
    removeEndpoint(url: string): void;
    getEndpoint(): string | null;
    private roundRobin;
    private weighted;
    private leastConnections;
    private random;
    setHealth(url: string, healthy: boolean): void;
    getHealth(url: string): boolean;
    getStrategy(): string;
    setStrategy(strategy: string): void;
    getEndpoints(): string[];
    getWeight(url: string): number;
    setWeight(url: string, weight: number): void;
    getHealthyEndpoints(): string[];
    getUnhealthyEndpoints(): string[];
    clear(): void;
}
//# sourceMappingURL=LoadBalancer.d.ts.map