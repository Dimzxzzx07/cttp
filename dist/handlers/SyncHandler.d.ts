import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
export declare class SyncHandler implements IMethodHandler {
    private syncStates;
    constructor();
    handle(request: IHTTPRequest): Promise<IHTTPResponse>;
    private generateSyncId;
    private getChanges;
    private detectConflicts;
}
//# sourceMappingURL=SyncHandler.d.ts.map