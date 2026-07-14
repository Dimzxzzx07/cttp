export declare class ArchiveHandler {
    private archives;
    private compressionLevel;
    constructor();
    archive(data: any, options?: any): Promise<any>;
    extract(archiveId: string): Promise<any>;
    private compress;
    private decompress;
    private createZip;
    private createTar;
    private extractZip;
    private extractTar;
    private generateArchiveId;
    getArchive(archiveId: string): any;
    getArchives(): string[];
    deleteArchive(archiveId: string): void;
    clear(): void;
    setCompressionLevel(level: number): void;
    getCompressionLevel(): number;
    getSize(archiveId: string): number;
    getOriginalSize(archiveId: string): number;
}
//# sourceMappingURL=ArchiveHandler.d.ts.map