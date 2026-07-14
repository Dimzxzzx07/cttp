import { IHTTPRequest } from "./IHTTPRequest";
import { IHTTPResponse } from "./IHTTPResponse";
export interface IMethodHandler {
    handle(request: IHTTPRequest): Promise<IHTTPResponse>;
}
//# sourceMappingURL=IMethodHandler.d.ts.map