export declare namespace MergeTypes {
    interface MergeOptions {
        mergeId?: string;
        strategy?: "union" | "intersection" | "difference" | "existing" | "incoming";
        autoResolve?: boolean;
    }
    interface MergeSession {
        id: string;
        url: string;
        conflicts: any[];
        resolved: string[];
        status: "initiated" | "resolving" | "completed" | "failed" | "rolledback";
        timestamp: number;
        strategy: string;
    }
    interface MergeResponse {
        mergeId: string;
        resolved: any[];
        conflicts: any[];
        status: "success" | "partial" | "failed";
        timestamp: number;
    }
}
//# sourceMappingURL=MergeTypes.d.ts.map