export namespace SyncTypes {
  export interface SyncOptions {
    lastSync: string;
    syncId?: string;
    options?: any;
  }

  export interface SyncState {
    id: string;
    url: string;
    lastSync: number;
    currentSync: number;
    changes: any[];
    conflicts: any[];
    status: "success" | "partial" | "failed";
  }

  export interface SyncResponse {
    syncId: string;
    timestamp: number;
    changes: any[];
    conflicts: any[];
    version: string;
    total: number;
  }

  export interface PullOptions {
    since?: string;
    limit?: number;
    filter?: any;
  }

  export interface PushOptions {
    changes: any[];
    version?: string;
  }

  export interface PullResponse {
    changes: any[];
    timestamp: number;
    version: string;
  }

  export interface PushResponse {
    accepted: number;
    rejected: number;
    timestamp: number;
  }
}