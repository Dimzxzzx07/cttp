import { ConfigTypes } from "../types/ConfigTypes";
import { MergeTypes } from "../types/MergeTypes";
export declare class MergeEngine {
    private client;
    private bufferUtils;
    private cryptoUtils;
    private constants;
    private config;
    private mergeSessions;
    private conflictResolutions;
    constructor(config: ConfigTypes.MergeConfig);
    merge(url: string, conflicts: any[], options?: MergeTypes.MergeOptions): Promise<MergeTypes.MergeResponse>;
    private generateMergeId;
    resolveConflict(url: string, mergeId: string, conflictId: string, resolution: any): Promise<void>;
    rollback(mergeId: string): Promise<void>;
    getMergeSession(mergeId: string): MergeTypes.MergeSession | undefined;
    getMergeSessions(): MergeTypes.MergeSession[];
    getResolution(conflictId: string): any;
    clearMergeSession(mergeId: string): void;
    clearAllSessions(): void;
    close(): Promise<void>;
}
//# sourceMappingURL=MergeEngine.d.ts.map