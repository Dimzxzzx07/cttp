/// <reference types="node" />
/// <reference types="node" />
export declare namespace UploadTypes {
    interface UploadOptions {
        file: string | Buffer;
        resumable?: boolean;
        sessionId?: string;
        chunkSize?: number;
        parallelChunks?: number;
        onProgress?: (progress: number) => void;
        onChunkComplete?: (chunkIndex: number) => void;
    }
    interface UploadSession {
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
    interface UploadResult {
        sessionId: string;
        fileUrl: string;
        fileSize: number;
        fileHash: string;
        status: string;
        uploadedAt: string;
        progress?: number;
    }
}
//# sourceMappingURL=UploadTypes.d.ts.map