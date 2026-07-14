import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
export declare class UploadHandler implements IMethodHandler {
    private uploads;
    constructor();
    handle(request: IHTTPRequest): Promise<IHTTPResponse>;
    private handleResumableUpload;
    private generateSessionId;
    private calculateHash;
    private generateFileUrl;
    private assembleChunks;
}
//# sourceMappingURL=UploadHandler.d.ts.map