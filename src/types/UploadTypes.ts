export namespace UploadTypes {
  export interface UploadOptions {
    file: string | Buffer;
    resumable?: boolean;
    sessionId?: string;
    chunkSize?: number;
    parallelChunks?: number;
    onProgress?: (progress: number) => void;
    onChunkComplete?: (chunkIndex: number) => void;
  }

  export interface UploadSession {
    id: string;
    url: string;
    totalSize: number;
    chunkSize: number;
    totalChunks: number;
    uploadedChunks: Set<number>;
    status: "initiated" | "uploading" | "paused" | "completed" | "failed" | "cancelled";
    startTime: number;
    lastUpdate: number;
  }

  export interface UploadResult {
    sessionId: string;
    fileUrl: string;
    fileSize: number;
    fileHash: string;
    status: string;
    uploadedAt: string;
    progress?: number;
  }
}