import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
import { CTTPResponse } from "../core/CTTPResponse";
import { HTTPVersion } from "../core/HTTPVersion";

export class UndoHandler implements IMethodHandler {
  private undoHistory: Map<string, any[]>;
  private undoStack: Map<string, any[]>;

  constructor() {
    this.undoHistory = new Map();
    this.undoStack = new Map();
  }

  public async handle(request: IHTTPRequest): Promise<IHTTPResponse> {
    const body = request.getBody();
    const resourceId = body?.resourceId || this.extractResourceId(request.getURL());
    const options = body?.options || {};
    
    if (!resourceId) {
      return new CTTPResponse(
        400,
        "Bad Request",
        HTTPVersion.HTTP_1_1,
        new Map([["Content-Type", "application/json"]]),
        { error: "Missing resourceId" }
      );
    }
    
    const previousState = this.getPreviousState(resourceId);
    if (!previousState) {
      return new CTTPResponse(
        404,
        "Not Found",
        HTTPVersion.HTTP_1_1,
        new Map([["Content-Type", "application/json"]]),
        { error: "No undoable action found" }
      );
    }
    
    const newState = this.undoAction(previousState);
    const undoId = this.generateUndoId();
    
    const entry = {
      id: undoId,
      resourceId,
      timestamp: Date.now(),
      action: options.action || "unknown",
      status: "success",
      previousState,
      newState
    };
    
    this.addToHistory(resourceId, entry);
    this.addToStack(resourceId, entry);
    
    return new CTTPResponse(
      200,
      "OK",
      HTTPVersion.HTTP_1_1,
      new Map([["Content-Type", "application/json"]]),
      {
        undoId,
        resourceId,
        status: "success",
        timestamp: Date.now(),
        message: "Undo successful",
        previousState,
        newState
      }
    );
  }

  private extractResourceId(url: string): string {
    const parts = url.split("/");
    return parts[parts.length - 1] || url;
  }

  private generateUndoId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  private getPreviousState(resourceId: string): any {
    if (!this.undoStack.has(resourceId)) {
      return null;
    }
    const stack = this.undoStack.get(resourceId)!;
    if (stack.length === 0) {
      return null;
    }
    return stack[stack.length - 1].newState;
  }

  private undoAction(previousState: any): any {
    return {
      ...previousState,
      _undoMeta: {
        timestamp: Date.now(),
        action: "undo"
      }
    };
  }

  private addToHistory(resourceId: string, entry: any): void {
    if (!this.undoHistory.has(resourceId)) {
      this.undoHistory.set(resourceId, []);
    }
    const history = this.undoHistory.get(resourceId)!;
    history.push(entry);
    if (history.length > 100) {
      history.shift();
    }
  }

  private addToStack(resourceId: string, entry: any): void {
    if (!this.undoStack.has(resourceId)) {
      this.undoStack.set(resourceId, []);
    }
    const stack = this.undoStack.get(resourceId)!;
    stack.push(entry);
    if (stack.length > 50) {
      stack.shift();
    }
  }

  public getHistory(resourceId: string): any[] {
    return this.undoHistory.get(resourceId) || [];
  }

  public getStack(resourceId: string): any[] {
    return this.undoStack.get(resourceId) || [];
  }

  public clearHistory(resourceId: string): void {
    this.undoHistory.delete(resourceId);
  }

  public clearStack(resourceId: string): void {
    this.undoStack.delete(resourceId);
  }

  public clearAll(): void {
    this.undoHistory.clear();
    this.undoStack.clear();
  }
}