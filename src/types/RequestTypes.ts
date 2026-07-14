export namespace RequestTypes {
  export interface BaseOptions {
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

  export interface GetOptions extends BaseOptions {}
  export interface PostOptions extends BaseOptions {
    body?: any;
  }
  export interface PutOptions extends BaseOptions {
    body?: any;
  }
  export interface PatchOptions extends BaseOptions {
    body?: any;
  }
  export interface DeleteOptions extends BaseOptions {}
  export interface HeadOptions extends BaseOptions {}
  export interface OptionsOptions extends BaseOptions {}

  export interface LoginCredentials {
    username?: string;
    email?: string;
    password: string;
    [key: string]: any;
  }

  export interface SyncOptions {
    lastSync: string;
    syncId?: string;
    options?: any;
  }

  export interface MergeOptions {
    conflicts: any[];
    mergeId?: string;
    strategy?: "union" | "intersection" | "difference" | "existing" | "incoming";
  }

  export interface StreamOptions {
    event?: string;
    data?: any;
    encoding?: string;
  }

  export interface UploadOptions {
    file: string | Buffer;
    resumable?: boolean;
    sessionId?: string;
    chunkIndex?: number;
    totalChunks?: number;
    chunkSize?: number;
  }

  export interface ResumableUploadOptions {
    chunkSize?: number;
    parallelChunks?: number;
    onProgress?: (progress: number) => void;
  }

  export interface ConvertOptions {
    file: string | Buffer;
    targetFormat: string;
    options?: any;
  }

  export interface ArchiveOptions {
    action?: "compress" | "move" | "restore";
    target?: string;
  }

  export interface AuditOptions {
    resourceId?: string;
    startTime?: string;
    endTime?: string;
    limit?: number;
    filter?: any;
  }

  export interface VerifyOptions {
    type: "otp" | "email" | "phone" | "json" | "jwt" | "signature" | "checksum";
    value: any;
    options?: any;
  }

  export interface PingOptions {
    data?: any;
  }

  export interface NotifyOptions {
    event: string;
    data: any;
    source?: string;
    priority?: "low" | "normal" | "high";
  }

  export interface UndoOptions {
    resourceId?: string;
    action?: string;
  }
}