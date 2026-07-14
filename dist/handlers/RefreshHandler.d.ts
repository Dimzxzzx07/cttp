import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
export declare class RefreshHandler implements IMethodHandler {
    private refreshTokens;
    constructor();
    handle(request: IHTTPRequest): Promise<IHTTPResponse>;
    private validateRefreshToken;
    private getUserData;
    private generateAccessToken;
    private generateRefreshToken;
}
//# sourceMappingURL=RefreshHandler.d.ts.map