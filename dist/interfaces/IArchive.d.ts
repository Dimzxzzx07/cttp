export interface IArchive {
    archive(data: any, options?: any): Promise<any>;
    extract(archiveId: string): Promise<any>;
    getArchive(archiveId: string): any;
    getArchives(): string[];
    deleteArchive(archiveId: string): void;
    clear(): void;
}
//# sourceMappingURL=IArchive.d.ts.map