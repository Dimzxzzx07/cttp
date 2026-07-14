import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
import { CTTPResponse } from "../core/CTTPResponse";
import { HTTPVersion } from "../core/HTTPVersion";

export class MergeHandler implements IMethodHandler {
  private mergeSessions: Map<string, any>;

  constructor() {
    this.mergeSessions = new Map();
  }

  public async handle(request: IHTTPRequest): Promise<IHTTPResponse> {
    const body = request.getBody();
    const conflicts = body?.conflicts || [];
    const mergeId = body?.mergeId || this.generateMergeId();
    const strategy = body?.strategy || "union";
    
    if (conflicts.length === 0) {
      return new CTTPResponse(
        400,
        "Bad Request",
        HTTPVersion.HTTP_1_1,
        new Map([["Content-Type", "application/json"]]),
        { error: "No conflicts to merge" }
      );
    }
    
    const resolved = this.resolveConflicts(conflicts, strategy);
    const remainingConflicts = this.getRemainingConflicts(conflicts, resolved);
    
    this.mergeSessions.set(mergeId, {
      conflicts,
      resolved,
      strategy,
      status: "completed",
      timestamp: Date.now()
    });
    
    return new CTTPResponse(
      200,
      "OK",
      HTTPVersion.HTTP_1_1,
      new Map([["Content-Type", "application/json"]]),
      {
        mergeId,
        resolved,
        conflicts: remainingConflicts,
        status: remainingConflicts.length === 0 ? "success" : "partial",
        timestamp: Date.now()
      }
    );
  }

  private generateMergeId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  private resolveConflicts(conflicts: any[], strategy: string): any[] {
    const resolved = [];
    for (const conflict of conflicts) {
      const resolution = this.resolveConflict(conflict, strategy);
      if (resolution) {
        resolved.push(resolution);
      }
    }
    return resolved;
  }

  private resolveConflict(conflict: any, strategy: string): any {
    switch (strategy) {
      case "union":
        return {
          ...conflict.existing,
          ...conflict.incoming
        };
      case "intersection":
        return this.intersectObjects(conflict.existing, conflict.incoming);
      case "difference":
        return this.differenceObjects(conflict.existing, conflict.incoming);
      case "existing":
        return conflict.existing;
      case "incoming":
        return conflict.incoming;
      default:
        return null;
    }
  }

  private intersectObjects(obj1: any, obj2: any): any {
    const result = {};
    for (const key of Object.keys(obj1)) {
      if (obj2.hasOwnProperty(key)) {
        result[key] = obj1[key];
      }
    }
    return result;
  }

  private differenceObjects(obj1: any, obj2: any): any {
    const result = {};
    for (const key of Object.keys(obj1)) {
      if (!obj2.hasOwnProperty(key)) {
        result[key] = obj1[key];
      }
    }
    return result;
  }

  private getRemainingConflicts(conflicts: any[], resolved: any[]): any[] {
    const resolvedIds = new Set(resolved.map(r => r.id || r.resource));
    return conflicts.filter(c => !resolvedIds.has(c.id || c.resource));
  }
}