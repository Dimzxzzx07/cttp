import { ConfigTypes } from "../types/ConfigTypes";

export class ConfigManager {
  private config: any;
  private defaults: any;

  constructor(config?: any) {
    this.defaults = this.getDefaultConfig();
    this.config = this.mergeConfig(this.defaults, config || {});
  }

  private getDefaultConfig(): any {
    return {
      defaultTimeout: 30000,
      defaultVersion: "HTTP/1.1",
      enableTunnel: false,
      logLevel: "info",
      poolConfig: {
        maxConnections: 100,
        idleTimeout: 60000,
        connectionTimeout: 30000
      }
    };
  }

  private mergeConfig(defaults: any, custom: any): any {
    const merged = { ...defaults };
    for (const key of Object.keys(custom)) {
      const value = custom[key];
      if (value !== undefined && value !== null) {
        if (typeof value === "object" && !Buffer.isBuffer(value)) {
          merged[key] = { ...(merged[key] || {}), ...value };
        } else {
          merged[key] = value;
        }
      }
    }
    return merged;
  }

  public getConfig(): any {
    return { ...this.config };
  }

  public update(config: any): void {
    this.config = this.mergeConfig(this.config, config);
  }

  public reset(): void {
    this.config = { ...this.defaults };
  }

  public get<T>(key: string): T {
    return this.config[key] as T;
  }

  public set<T>(key: string, value: T): void {
    if (typeof value === "object" && !Buffer.isBuffer(value)) {
      this.config[key] = { ...(this.config[key] || {}), ...value };
    } else {
      this.config[key] = value;
    }
  }
}
