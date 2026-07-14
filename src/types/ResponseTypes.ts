export namespace ResponseTypes {
  export interface BaseResponse {
    status: number;
    headers: Record<string, string>;
    body: any;
    timestamp: number;
    duration: number;
  }

  export interface SyncResponse {
    syncId: string;
    timestamp: number;
    changes: any[];
    conflicts: any[];
    version: string;
    total: number;
  }

  export interface MergeResponse {
    mergeId: string;
    resolved: any[];
    conflicts: any[];
    status: "success" | "partial" | "failed";
    timestamp: number;
  }

  export interface UploadResponse {
    sessionId: string;
    fileUrl: string;
    fileSize: number;
    fileHash: string;
    status: "uploading" | "completed" | "failed";
    uploadedAt: string;
    progress?: number;
  }

  export interface ConvertResponse {
    file: string;
    format: string;
    size: number;
    hash: string;
    convertedAt: string;
  }

  export interface ArchiveResponse {
    archiveId: string;
    status: "compressed" | "moved" | "restored";
    location: string;
    size: number;
    archivedAt: string;
  }

  export interface AuditResponse {
    auditId: string;
    entries: any[];
    total: number;
    timestamp: number;
    version: string;
  }

  export interface VerifyResponse {
    valid: boolean;
    message: string;
    timestamp: number;
    details: any;
  }

  export interface PingResponse {
    status: string;
    timestamp: number;
    uptime: number;
    pingId: string;
    count: number;
    data: any;
  }

  export interface NotifyResponse {
    id: string;
    event: string;
    timestamp: number;
    status: string;
    message: string;
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

  export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
  }
}