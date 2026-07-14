import { HTTPMethod } from "./HTTPMethod";
import { ConfigTypes } from "../types/ConfigTypes";
export declare class MethodInterceptor {
    private config;
    private constants;
    private customMethods;
    constructor(config: ConfigTypes.InterceptorConfig);
    intercept(method: HTTPMethod, headers: Map<string, string>): HTTPMethod;
    private isCustomMethod;
    addCustomMethod(method: string): void;
    removeCustomMethod(method: string): void;
    getCustomMethods(): string[];
    isMethodSupported(method: string): boolean;
}
//# sourceMappingURL=MethodInterceptor.d.ts.map