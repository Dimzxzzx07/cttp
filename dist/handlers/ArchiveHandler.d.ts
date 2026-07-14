import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
export declare class ArchiveHandler implements IMethodHandler {
    private archives;
    constructor();
    handle(request: IHTTPRequest): Promise<IHTTPResponse>;
    private compress;
    private move;
    private restore;
    private compressData;
    private decompressData;
    private generateArchiveId;
    getArchive(archiveId: string): any;
    getArchives(): string[];
    deleteArchive(archiveId: string): void;
    clear(): void;
}
//# sourceMappingURL=ArchiveHandler.d.ts.map