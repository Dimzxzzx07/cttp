import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
export declare class UndoHandler implements IMethodHandler {
    private undoHistory;
    private undoStack;
    constructor();
    handle(request: IHTTPRequest): Promise<IHTTPResponse>;
    private extractResourceId;
    private generateUndoId;
    private getPreviousState;
    private undoAction;
    private addToHistory;
    private addToStack;
    getHistory(resourceId: string): any[];
    getStack(resourceId: string): any[];
    clearHistory(resourceId: string): void;
    clearStack(resourceId: string): void;
    clearAll(): void;
}
//# sourceMappingURL=UndoHandler.d.ts.map