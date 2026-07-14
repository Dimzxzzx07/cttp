import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
export declare class HTTP3Session {
    private connection;
    private quicSession;
    constructor(connection: any, quicSession: any);
    send(request: IHTTPRequest): Promise<IHTTPResponse>;
    close(): Promise<void>;
}
//# sourceMappingURL=HTTP3Session.d.ts.map