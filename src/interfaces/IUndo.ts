export interface IUndo {
  undo(url: string, options?: any): Promise<any>;
  redo(url: string, undoId: string): Promise<any>;
  getHistory(resourceId: string): Promise<any[]>;
  getUndoStack(resourceId: string): Promise<any[]>;
  clearHistory(resourceId: string): void;
}