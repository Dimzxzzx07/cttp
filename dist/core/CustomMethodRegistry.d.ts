import { IMethodHandler } from "../interfaces/IMethodHandler";
import { ConfigTypes } from "../types/ConfigTypes";
export declare class CustomMethodRegistry {
    private handlers;
    private config;
    constructor(config?: ConfigTypes.RegistryConfig);
    register(method: string, handler: IMethodHandler): void;
    unregister(method: string): void;
    getHandler(method: string): IMethodHandler | undefined;
    hasHandler(method: string): boolean;
    getRegisteredMethods(): string[];
    clear(): void;
    setConfig(config: ConfigTypes.RegistryConfig): void;
    getConfig(): ConfigTypes.RegistryConfig;
}
//# sourceMappingURL=CustomMethodRegistry.d.ts.map