import { CTTPClient } from "./CTTPClient";
import { CTTPRequest } from "./CTTPRequest";
import { CTTPResponse } from "./CTTPResponse";
import { HTTPMethod } from "./HTTPMethod";
import { ConfigTypes } from "../types/ConfigTypes";
import { AuditTypes } from "../types/AuditTypes";
import { BufferUtils } from "../utils/BufferUtils";
import { CryptoUtils } from "../utils/CryptoUtils";
import { Constants } from "./Constants";

export class AuditLogger {
  private client: CTTPClient;
  private bufferUtils: BufferUtils;
  private cryptoUtils: CryptoUtils;
  private constants: Constants;
  private config: ConfigTypes.AuditConfig;
  private auditCache: Map<string, AuditTypes.AuditEntry[]>;
  private auditFilters: Map<string, any>;

  constructor(config: ConfigTypes.AuditConfig) {
    this.config = config;
    this.constants = new Constants();
    this.bufferUtils = new BufferUtils();
    this.cryptoUtils = new CryptoUtils();
    this.client = new CTTPClient();
    this.auditCache = new Map();
    this.auditFilters = new Map();
  }

  public async audit(
    url: string,
    options?: AuditTypes.AuditOptions
  ): Promise<AuditTypes.AuditResponse> {
    const auditId = this.generateAuditId();
    
    const request = new CTTPRequest(
      HTTPMethod.AUDIT,
      url,
      {
        body: {
          auditId,
          options: options || {},
          timestamp: Date.now()
        }
      }
    );
    
    const response = await this.client.request(request);
    const data = response.getBody();
    const entries = data.entries || [];
    
    this.auditCache.set(auditId, entries);
    
    return {
      auditId,
      entries,
      total: data.total || entries.length,
      timestamp: data.timestamp || Date.now(),
      version: data.version || "1.0"
    };
  }

  private generateAuditId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  public async getAuditTrail(
    resourceId: string,
    options?: AuditTypes.AuditOptions
  ): Promise<AuditTypes.AuditEntry[]> {
    const request = new CTTPRequest(
      HTTPMethod.GET,
      `/audit/${resourceId}`,
      {
        body: options || {}
      }
    );
    const response = await this.client.request(request);
    const data = response.getBody();
    return data.entries || [];
  }

  public async filterAudit(
    url: string,
    filter: any
  ): Promise<AuditTypes.AuditEntry[]> {
    const filterId = this.generateAuditId();
    this.auditFilters.set(filterId, filter);
    
    const request = new CTTPRequest(
      HTTPMethod.POST,
      `${url}/filter`,
      {
        body: {
          filterId,
          filter
        }
      }
    );
    
    const response = await this.client.request(request);
    const data = response.getBody();
    return data.entries || [];
  }

  public async exportAudit(
    url: string,
    format: string = "json"
  ): Promise<Buffer> {
    const request = new CTTPRequest(
      HTTPMethod.GET,
      `${url}/export`,
      {
        query: { format }
      }
    );
    
    const response = await this.client.request(request);
    return response.getBodyAsBuffer();
  }

  public getAuditEntries(auditId: string): AuditTypes.AuditEntry[] | undefined {
    return this.auditCache.get(auditId);
  }

  public clearCache(auditId?: string): void {
    if (auditId) {
      this.auditCache.delete(auditId);
    } else {
      this.auditCache.clear();
    }
  }

  public getFilter(filterId: string): any {
    return this.auditFilters.get(filterId);
  }

  public clearFilters(): void {
    this.auditFilters.clear();
  }

  public async close(): Promise<void> {
    await this.client.close();
    this.auditCache.clear();
    this.auditFilters.clear();
  }
}