export declare namespace SyncTypes {
    interface SyncOptions {
        lastSync: string;
        syncId?: string;
        options?: any;
    }
    interface SyncState {
        id: string;
        url: string;
        lastSync: number;
        currentSync: number;
        changes: any[];
        conflicts: any[];
        status: "success" | "partial" | "failed";
    }
    interface SyncResponse {
        syncId: string;
        timestamp: number;
        changes: any[];
        conflicts: any[];
        version: string;
        total: number;
    }
    interface PullOptions {
        since?: string;
        limit?: number;
        filter?: any;
    }
    interface PushOptions {
        changes: any[];
        version?: string;
    }
    interface PullResponse {
        changes: any[];
        timestamp: number;
        version: string;
    }
    interface PushResponse {
        accepted: number;
        rejected: number;
        timestamp: number;
    }
}
//# sourceMappingURL=SyncTypes.d.ts.map