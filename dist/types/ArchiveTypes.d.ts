export declare namespace ArchiveTypes {
    interface ArchiveOptions {
        format?: "gzip" | "deflate" | "brotli" | "zlib" | "zip" | "tar";
        level?: number;
        target?: string;
        action?: "compress" | "move" | "restore";
    }
    interface ArchiveMetadata {
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
    interface ArchiveResult {
        archiveId: string;
        status: string;
        location: string;
        size: number;
        archivedAt: string;
    }
}
//# sourceMappingURL=ArchiveTypes.d.ts.map