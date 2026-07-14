import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
export declare class LogoutHandler implements IMethodHandler {
    handle(request: IHTTPRequest): Promise<IHTTPResponse>;
    private validateToken;
    private invalidateToken;
}
//# sourceMappingURL=LogoutHandler.d.ts.map