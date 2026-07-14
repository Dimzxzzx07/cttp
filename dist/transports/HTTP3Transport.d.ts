import { IConnection } from "../interfaces/IConnection";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
export declare class HTTP3Transport {
    private connection;
    constructor(connection: IConnection);
    send(request: IHTTPRequest): Promise<IHTTPResponse>;
    close(): Promise<void>;
}
//# sourceMappingURL=HTTP3Transport.d.ts.map