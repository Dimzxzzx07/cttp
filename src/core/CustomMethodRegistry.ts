import { IMethodHandler } from "../interfaces/IMethodHandler";
import { ConfigTypes } from "../types/ConfigTypes";

export class CustomMethodRegistry {
  private handlers: Map<string, IMethodHandler>;
  private config: ConfigTypes.RegistryConfig;

  constructor(config?: ConfigTypes.RegistryConfig) {
    this.handlers = new Map();
    this.config = config || { allowOverride: false, strictMode: true };
  }

  public register(method: string, handler: IMethodHandler): void {
    if (this.handlers.has(method) && !this.config.allowOverride) {
      throw new Error(`Method ${method} already registered`);
    }
    this.handlers.set(method, handler);
  }

  public unregister(method: string): void {
    this.handlers.delete(method);
  }

  public getHandler(method: string): IMethodHandler | undefined {
    return this.handlers.get(method);
  }

  public hasHandler(method: string): boolean {
    return this.handlers.has(method);
  }

  public getRegisteredMethods(): string[] {
    return Array.from(this.handlers.keys());
  }

  public clear(): void {
    this.handlers.clear();
  }

  public setConfig(config: ConfigTypes.RegistryConfig): void {
    this.config = { ...this.config, ...config };
  }

  public getConfig(): ConfigTypes.RegistryConfig {
    return { ...this.config };
  }
}