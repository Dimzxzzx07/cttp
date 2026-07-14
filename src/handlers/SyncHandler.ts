import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
import { CTTPResponse } from "../core/CTTPResponse";
import { HTTPVersion } from "../core/HTTPVersion";

export class SyncHandler implements IMethodHandler {
  private syncStates: Map<string, any>;

  constructor() {
    this.syncStates = new Map();
  }

  public async handle(request: IHTTPRequest): Promise<IHTTPResponse> {
    const body = request.getBody();
    const lastSync = body?.lastSync;
    const syncId = body?.syncId || this.generateSyncId();
    
    if (!lastSync) {
      return new CTTPResponse(
        400,
        "Bad Request",
        HTTPVersion.HTTP_1_1,
        new Map([["Content-Type", "application/json"]]),
        { error: "Missing lastSync timestamp" }
      );
    }
    
    const changes = this.getChanges(lastSync);
    const conflicts = this.detectConflicts(changes);
    const timestamp = Date.now();
    
    this.syncStates.set(syncId, {
      lastSync,
      currentSync: timestamp,
      changes,
      conflicts,
      status: "success"
    });
    
    return new CTTPResponse(
      200,
      "OK",
      HTTPVersion.HTTP_1_1,
      new Map([["Content-Type", "application/json"]]),
      {
        syncId,
        timestamp,
        changes,
        conflicts,
        version: "1.0",
        total: changes.length
      }
    );
  }

  private generateSyncId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  private getChanges(lastSync: string): any[] {
    const lastSyncTime = new Date(lastSync).getTime();
    const changes = [];
    for (let i = 0; i < 10; i++) {
      const timestamp = lastSyncTime + i * 1000;
      if (timestamp > Date.now()) break;
      changes.push({
        id: `change-${i}`,
        type: i % 3 === 0 ? "update" : i % 3 === 1 ? "create" : "delete",
        timestamp: new Date(timestamp).toISOString(),
        data: { value: i }
      });
    }
    return changes;
  }

  private detectConflicts(changes: any[]): any[] {
    const conflicts = [];
    const resourceMap = new Map();
    for (const change of changes) {
      const key = change.id;
      if (resourceMap.has(key)) {
        conflicts.push({
          resource: key,
          existing: resourceMap.get(key),
          incoming: change,
          resolution: "pending"
        });
      }
      resourceMap.set(key, change);
    }
    return conflicts;
  }
}