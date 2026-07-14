import { CTTPClient } from "./CTTPClient";
import { CTTPRequest } from "./CTTPRequest";
import { CTTPResponse } from "./CTTPResponse";
import { HTTPMethod } from "./HTTPMethod";
import { ConfigTypes } from "../types/ConfigTypes";
import { MergeTypes } from "../types/MergeTypes";
import { BufferUtils } from "../utils/BufferUtils";
import { CryptoUtils } from "../utils/CryptoUtils";
import { Constants } from "./Constants";

export class MergeEngine {
  private client: CTTPClient;
  private bufferUtils: BufferUtils;
  private cryptoUtils: CryptoUtils;
  private constants: Constants;
  private config: ConfigTypes.MergeConfig;
  private mergeSessions: Map<string, MergeTypes.MergeSession>;
  private conflictResolutions: Map<string, any>;

  constructor(config: ConfigTypes.MergeConfig) {
    this.config = config;
    this.constants = new Constants();
    this.bufferUtils = new BufferUtils();
    this.cryptoUtils = new CryptoUtils();
    this.client = new CTTPClient();
    this.mergeSessions = new Map();
    this.conflictResolutions = new Map();
  }

  public async merge(
    url: string,
    conflicts: any[],
    options?: MergeTypes.MergeOptions
  ): Promise<MergeTypes.MergeResponse> {
    const mergeId = this.generateMergeId();
    const session: MergeTypes.MergeSession = {
      id: mergeId,
      url,
      conflicts: conflicts,
      resolved: [],
      status: "initiated",
      timestamp: Date.now(),
      strategy: options?.strategy || this.config.defaultStrategy
    };
    
    this.mergeSessions.set(mergeId, session);
    
    try {
      const request = new CTTPRequest(
        HTTPMethod.MERGE,
        url,
        {
          body: {
            mergeId,
            conflicts,
            options: options || {}
          }
        }
      );
      
      const response = await this.client.request(request);
      const data = response.getBody();
      
      session.status = "completed";
      
      return {
        mergeId,
        resolved: data.resolved || [],
        conflicts: data.conflicts || [],
        status: data.status || "success",
        timestamp: data.timestamp || Date.now()
      };
    } catch (error) {
      session.status = "failed";
      throw error;
    }
  }

  private generateMergeId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  public async resolveConflict(
    url: string,
    mergeId: string,
    conflictId: string,
    resolution: any
  ): Promise<void> {
    const session = this.mergeSessions.get(mergeId);
    if (!session) {
      throw new Error(`Merge session ${mergeId} not found`);
    }
    
    const request = new CTTPRequest(
      HTTPMethod.POST,
      `${url}/resolve`,
      {
        body: {
          mergeId,
          conflictId,
          resolution
        }
      }
    );
    
    await this.client.request(request);
    session.resolved.push(conflictId);
    this.conflictResolutions.set(conflictId, resolution);
  }

  public async rollback(mergeId: string): Promise<void> {
    const session = this.mergeSessions.get(mergeId);
    if (!session) {
      throw new Error(`Merge session ${mergeId} not found`);
    }
    
    const request = new CTTPRequest(
      HTTPMethod.POST,
      `${session.url}/rollback`,
      {
        body: { mergeId }
      }
    );
    
    await this.client.request(request);
    session.status = "rolledback";
  }

  public getMergeSession(mergeId: string): MergeTypes.MergeSession | undefined {
    return this.mergeSessions.get(mergeId);
  }

  public getMergeSessions(): MergeTypes.MergeSession[] {
    return Array.from(this.mergeSessions.values());
  }

  public getResolution(conflictId: string): any {
    return this.conflictResolutions.get(conflictId);
  }

  public clearMergeSession(mergeId: string): void {
    this.mergeSessions.delete(mergeId);
  }

  public clearAllSessions(): void {
    this.mergeSessions.clear();
    this.conflictResolutions.clear();
  }

  public async close(): Promise<void> {
    await this.client.close();
    this.mergeSessions.clear();
    this.conflictResolutions.clear();
  }
}