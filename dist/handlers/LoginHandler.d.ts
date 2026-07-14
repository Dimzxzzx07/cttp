import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
export declare class LoginHandler implements IMethodHandler {
    handle(request: IHTTPRequest): Promise<IHTTPResponse>;
    private generateToken;
    private generateRefreshToken;
}
//# sourceMappingURL=LoginHandler.d.ts.map