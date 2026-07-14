export namespace UndoTypes {
  export interface UndoOptions {
    resourceId?: string;
    action?: string;
    snapshot?: any;
  }

  export interface UndoEntry {
    id: string;
    resourceId: string;
    url: string;
    timestamp: number;
    action: string;
    status: "success" | "failed" | "pending";
    previousState: any;
    newState: any;
  }

  export interface UndoHistory {
    id: string;
    resourceId: string;
    entries: UndoEntry[];
    createdAt: number;
    updatedAt: number;
  }

  export interface UndoResponse {
    undoId: string;
    resourceId: string;
    status: string;
    timestamp: number;
    message: string;
    previousState?: any;
    newState?: any;
  }
}