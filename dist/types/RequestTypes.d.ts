/// <reference types="node" />
/// <reference types="node" />
export declare namespace RequestTypes {
    interface BaseOptions {
        headers?: Record<string, string>;
        query?: Record<string, string>;
        timeout?: number;
        version?: string;
        tunnel?: boolean;
        chunked?: boolean;
        priority?: number;
        retries?: number;
        compress?: boolean;
        encrypt?: boolean;
    }
    interface GetOptions extends BaseOptions {
    }
    interface PostOptions extends BaseOptions {
        body?: any;
    }
    interface PutOptions extends BaseOptions {
        body?: any;
    }
    interface PatchOptions extends BaseOptions {
        body?: any;
    }
    interface DeleteOptions extends BaseOptions {
    }
    interface HeadOptions extends BaseOptions {
    }
    interface OptionsOptions extends BaseOptions {
    }
    interface LoginCredentials {
        username?: string;
        email?: string;
        password: string;
        [key: string]: any;
    }
    interface SyncOptions {
        lastSync: string;
        syncId?: string;
        options?: any;
    }
    interface MergeOptions {
        conflicts: any[];
        mergeId?: string;
        strategy?: "union" | "intersection" | "difference" | "existing" | "incoming";
    }
    interface StreamOptions {
        event?: string;
        data?: any;
        encoding?: string;
    }
    interface UploadOptions {
        file: string | Buffer;
        resumable?: boolean;
        sessionId?: string;
        chunkIndex?: number;
        totalChunks?: number;
        chunkSize?: number;
    }
    interface ResumableUploadOptions {
        chunkSize?: number;
        parallelChunks?: number;
        onProgress?: (progress: number) => void;
    }
    interface ConvertOptions {
        file: string | Buffer;
        targetFormat: string;
        options?: any;
    }
    interface ArchiveOptions {
        action?: "compress" | "move" | "restore";
        target?: string;
    }
    interface AuditOptions {
        resourceId?: string;
        startTime?: string;
        endTime?: string;
        limit?: number;
        filter?: any;
    }
    interface VerifyOptions {
        type: "otp" | "email" | "phone" | "json" | "jwt" | "signature" | "checksum";
        value: any;
        options?: any;
    }
    interface PingOptions {
        data?: any;
    }
    interface NotifyOptions {
        event: string;
        data: any;
        source?: string;
        priority?: "low" | "normal" | "high";
    }
    interface UndoOptions {
        resourceId?: string;
        action?: string;
    }
}
//# sourceMappingURL=RequestTypes.d.ts.map