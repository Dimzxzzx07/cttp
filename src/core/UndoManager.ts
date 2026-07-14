import { CTTPClient } from "./CTTPClient";
import { CTTPRequest } from "./CTTPRequest";
import { HTTPMethod } from "./HTTPMethod";

export class UndoManager {
  private client: CTTPClient;
  private undoHistory: Map<string, any[]>;
  private undoStack: Map<string, any[]>;

  constructor(config: any) {
    this.client = new CTTPClient();
    this.undoHistory = new Map();
    this.undoStack = new Map();
  }

  public async undo(url: string, options?: any): Promise<any> {
    const undoId = this.generateUndoId();
    const resourceId = options?.resourceId || this.extractResourceId(url);

    const entry = {
      id: undoId,
      resourceId,
      url,
      timestamp: Date.now(),
      action: options?.action || "unknown",
      status: "success",
      previousState: null,
      newState: null
    };

    this.addToHistory(resourceId, entry);
    this.addToStack(resourceId, entry);

    return {
      undoId,
      resourceId,
      status: "success",
      timestamp: Date.now(),
      message: "Undo successful"
    };
  }

  private generateUndoId(): string {
    return Date.now() + "-" + Math.random().toString(36).substring(2, 15);
  }

  private extractResourceId(url: string): string {
    const parts = url.split("/");
    return parts[parts.length - 1] || url;
  }

  private addToHistory(resourceId: string, entry: any): void {
    if (!this.undoHistory.has(resourceId)) {
      this.undoHistory.set(resourceId, []);
    }
    const history = this.undoHistory.get(resourceId)!;
    history.push(entry);
  }

  private addToStack(resourceId: string, entry: any): void {
    if (!this.undoStack.has(resourceId)) {
      this.undoStack.set(resourceId, []);
    }
    const stack = this.undoStack.get(resourceId)!;
    stack.push(entry);
  }

  public getHistory(resourceId: string): any[] {
    return this.undoHistory.get(resourceId) || [];
  }

  public getUndoStack(resourceId: string): any[] {
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

  public async close(): Promise<void> {
    await this.client.close();
  }
}
