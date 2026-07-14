export namespace ArchiveTypes {
  export interface ArchiveOptions {
    format?: "gzip" | "deflate" | "brotli" | "zlib" | "zip" | "tar";
    level?: number;
    target?: string;
    action?: "compress" | "move" | "restore";
  }

  export interface ArchiveMetadata {
    id: string;
    format: string;
    level: number;
    originalSize: number;
    compressedSize: number;
    timestamp: number;
    originalType: string;
    location?: string;
    moved?: boolean;
  }

  export interface ArchiveResult {
    archiveId: string;
    status: string;
    location: string;
    size: number;
    archivedAt: string;
  }
}