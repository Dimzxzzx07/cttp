import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
export declare class MergeHandler implements IMethodHandler {
    private mergeSessions;
    constructor();
    handle(request: IHTTPRequest): Promise<IHTTPResponse>;
    private generateMergeId;
    private resolveConflicts;
    private resolveConflict;
    private intersectObjects;
    private differenceObjects;
    private getRemainingConflicts;
}
//# sourceMappingURL=MergeHandler.d.ts.map