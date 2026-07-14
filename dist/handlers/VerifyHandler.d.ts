import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
export declare class VerifyHandler implements IMethodHandler {
    handle(request: IHTTPRequest): Promise<IHTTPResponse>;
    private verifyValue;
    private verifyOTP;
    private verifyEmail;
    private verifyPhone;
    private verifyJSON;
    private verifyJWT;
    private verifySignature;
    private verifyChecksum;
    private validateJSONSchema;
    private getDetails;
}
//# sourceMappingURL=VerifyHandler.d.ts.map