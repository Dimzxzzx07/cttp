export declare class SyncEngine {
    private client;
    private config;
    private syncStates;
    constructor(config: any);
    sync(url: string, lastSync: string, options?: any): Promise<any>;
    private generateSyncId;
    pull(url: string, options?: any): Promise<any>;
    push(url: string, options?: any): Promise<any>;
    resolveConflict(url: string, conflictId: string, resolution: any): Promise<void>;
    getSyncState(syncId: string): any;
    getSyncStates(): any[];
    clearSyncState(syncId: string): void;
    clearAllSyncStates(): void;
    close(): Promise<void>;
}
//# sourceMappingURL=SyncEngine.d.ts.map