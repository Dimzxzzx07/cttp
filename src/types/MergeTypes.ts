export namespace MergeTypes {
  export interface MergeOptions {
    mergeId?: string;
    strategy?: "union" | "intersection" | "difference" | "existing" | "incoming";
    autoResolve?: boolean;
  }

  export interface MergeSession {
    id: string;
    url: string;
    conflicts: any[];
    resolved: string[];
    status: "initiated" | "resolving" | "completed" | "failed" | "rolledback";
    timestamp: number;
    strategy: string;
  }

  export interface MergeResponse {
    mergeId: string;
    resolved: any[];
    conflicts: any[];
    status: "success" | "partial" | "failed";
    timestamp: number;
  }
}