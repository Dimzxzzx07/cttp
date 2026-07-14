import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
export declare class PingHandler implements IMethodHandler {
    private startTime;
    private pingCount;
    constructor();
    handle(request: IHTTPRequest): Promise<IHTTPResponse>;
    private generatePingId;
    getPingCount(): number;
    getUptime(): number;
    reset(): void;
}
//# sourceMappingURL=PingHandler.d.ts.map