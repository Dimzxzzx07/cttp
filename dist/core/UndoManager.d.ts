export declare class UndoManager {
    private client;
    private undoHistory;
    private undoStack;
    constructor(config: any);
    undo(url: string, options?: any): Promise<any>;
    private generateUndoId;
    private extractResourceId;
    private addToHistory;
    private addToStack;
    getHistory(resourceId: string): any[];
    getUndoStack(resourceId: string): any[];
    clearHistory(resourceId: string): void;
    clearStack(resourceId: string): void;
    clearAll(): void;
    close(): Promise<void>;
}
//# sourceMappingURL=UndoManager.d.ts.map