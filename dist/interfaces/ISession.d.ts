import { IHTTPRequest } from "./IHTTPRequest";
import { IHTTPResponse } from "./IHTTPResponse";
export interface ISession {
    send(request: IHTTPRequest): Promise<IHTTPResponse>;
    close(): Promise<void>;
}
//# sourceMappingURL=ISession.d.ts.map