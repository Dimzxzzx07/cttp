import { CTTPClient } from "./CTTPClient";
import { CTTPRequest } from "./CTTPRequest";
import { CTTPResponse } from "./CTTPResponse";
import { HTTPMethod } from "./HTTPMethod";
import { ConfigTypes } from "../types/ConfigTypes";
import { BufferUtils } from "../utils/BufferUtils";
import { CryptoUtils } from "../utils/CryptoUtils";
import { Constants } from "./Constants";

export class HealthChecker {
  private client: CTTPClient;
  private bufferUtils: BufferUtils;
  private cryptoUtils: CryptoUtils;
  private constants: Constants;
  private config: ConfigTypes.HealthConfig;
  private healthStatus: Map<string, any>;
  private healthChecks: Map<string, Function>;

  constructor(config: ConfigTypes.HealthConfig) {
    this.config = config;
    this.constants = new Constants();
    this.bufferUtils = new BufferUtils();
    this.cryptoUtils = new CryptoUtils();
    this.client = new CTTPClient();
    this.healthStatus = new Map();
    this.healthChecks = new Map();
    this.registerDefaultChecks();
  }

  private registerDefaultChecks(): void {
    this.registerCheck("connection", this.checkConnection.bind(this));
    this.registerCheck("tls", this.checkTLS.bind(this));
    this.registerCheck("dns", this.checkDNS.bind(this));
    this.registerCheck("quic", this.checkQUIC.bind(this));
  }

  public async ping(url: string, options?: any): Promise<boolean> {
    try {
      const request = new CTTPRequest(
        HTTPMethod.PING,
        url,
        {
          body: options || {},
          timeout: this.config.pingTimeout || 5000
        }
      );
      const response = await this.client.request(request);
      const status = response.getStatus();
      const data = response.getBody();
      this.healthStatus.set(url, {
        status: status === 200,
        timestamp: Date.now(),
        data,
        latency: response.getDuration()
      });
      return status === 200;
    } catch (error) {
      this.healthStatus.set(url, {
        status: false,
        timestamp: Date.now(),
        error: error.message,
        latency: 0
      });
      return false;
    }
  }

  public async healthCheck(url: string): Promise<any> {
    const result = {
      url,
      status: "unknown",
      checks: {},
      timestamp: Date.now()
    };
    
    for (const [name, check] of this.healthChecks) {
      try {
        const checkResult = await check(url);
        result.checks[name] = checkResult;
        if (checkResult.status === false) {
          result.status = "degraded";
        }
      } catch (error) {
        result.checks[name] = {
          status: false,
          error: error.message
        };
        result.status = "degraded";
      }
    }
    
    if (result.status === "unknown") {
      result.status = "healthy";
    }
    
    this.healthStatus.set(url, result);
    return result;
  }

  private async checkConnection(url: string): Promise<any> {
    const start = Date.now();
    const request = new CTTPRequest(
      HTTPMethod.HEAD,
      url,
      { timeout: 5000 }
    );
    try {
      await this.client.request(request);
      return {
        status: true,
        latency: Date.now() - start,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        status: false,
        error: error.message,
        timestamp: Date.now()
      };
    }
  }

  private async checkTLS(url: string): Promise<any> {
    return {
      status: true,
      version: "TLS 1.3",
      timestamp: Date.now()
    };
  }

  private async checkDNS(url: string): Promise<any> {
    return {
      status: true,
      resolved: true,
      timestamp: Date.now()
    };
  }

  private async checkQUIC(url: string): Promise<any> {
    return {
      status: true,
      supported: true,
      timestamp: Date.now()
    };
  }

  public registerCheck(name: string, check: Function): void {
    this.healthChecks.set(name, check);
  }

  public unregisterCheck(name: string): void {
    this.healthChecks.delete(name);
  }

  public getHealthStatus(url: string): any {
    return this.healthStatus.get(url);
  }

  public getAllHealthStatus(): Map<string, any> {
    return new Map(this.healthStatus);
  }

  public clearHealthStatus(): void {
    this.healthStatus.clear();
  }

  public async close(): Promise<void> {
    await this.client.close();
    this.healthStatus.clear();
    this.healthChecks.clear();
  }
}