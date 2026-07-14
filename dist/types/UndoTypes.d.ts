export declare namespace UndoTypes {
    interface UndoOptions {
        resourceId?: string;
        action?: string;
        snapshot?: any;
    }
    interface UndoEntry {
        id: string;
        resourceId: string;
        url: string;
        timestamp: number;
        action: string;
        status: "success" | "failed" | "pending";
        previousState: any;
        newState: any;
    }
    interface UndoHistory {
        id: string;
        resourceId: string;
        entries: UndoEntry[];
        createdAt: number;
        updatedAt: number;
    }
    interface UndoResponse {
        undoId: string;
        resourceId: string;
        status: string;
        timestamp: number;
        message: string;
        previousState?: any;
        newState?: any;
    }
}
//# sourceMappingURL=UndoTypes.d.ts.map