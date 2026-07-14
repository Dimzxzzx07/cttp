export declare class ConfigManager {
    private config;
    private defaults;
    constructor(config?: any);
    private getDefaultConfig;
    private mergeConfig;
    getConfig(): any;
    update(config: any): void;
    reset(): void;
    get<T>(key: string): T;
    set<T>(key: string, value: T): void;
}
//# sourceMappingURL=ConfigManager.d.ts.map