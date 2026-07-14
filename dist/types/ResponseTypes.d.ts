export declare namespace ResponseTypes {
    interface BaseResponse {
        status: number;
        headers: Record<string, string>;
        body: any;
        timestamp: number;
        duration: number;
    }
    interface SyncResponse {
        syncId: string;
        timestamp: number;
        changes: any[];
        conflicts: any[];
        version: string;
        total: number;
    }
    interface MergeResponse {
        mergeId: string;
        resolved: any[];
        conflicts: any[];
        status: "success" | "partial" | "failed";
        timestamp: number;
    }
    interface UploadResponse {
        sessionId: string;
        fileUrl: string;
        fileSize: number;
        fileHash: string;
        status: "uploading" | "completed" | "failed";
        uploadedAt: string;
        progress?: number;
    }
    interface ConvertResponse {
        file: string;
        format: string;
        size: number;
        hash: string;
        convertedAt: string;
    }
    interface ArchiveResponse {
        archiveId: string;
        status: "compressed" | "moved" | "restored";
        location: string;
        size: number;
        archivedAt: string;
    }
    interface AuditResponse {
        auditId: string;
        entries: any[];
        total: number;
        timestamp: number;
        version: string;
    }
    interface VerifyResponse {
        valid: boolean;
        message: string;
        timestamp: number;
        details: any;
    }
    interface PingResponse {
        status: string;
        timestamp: number;
        uptime: number;
        pingId: string;
        count: number;
        data: any;
    }
    interface NotifyResponse {
        id: string;
        event: string;
        timestamp: number;
        status: string;
        message: string;
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
    interface AuthResponse {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        tokenType: string;
    }
}
//# sourceMappingURL=ResponseTypes.d.ts.map