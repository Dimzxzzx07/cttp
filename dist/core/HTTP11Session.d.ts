import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
export declare class HTTP11Session {
    private connection;
    private tlsSession;
    private constants;
    private chunkedParser;
    private keepAlive;
    private pipelining;
    constructor(connection: any, tlsSession: any);
    send(request: IHTTPRequest): Promise<IHTTPResponse>;
    private buildRequestBuffer;
    private readResponse;
    close(): Promise<void>;
    setKeepAlive(keepAlive: boolean): void;
    setPipelining(pipelining: boolean): void;
}
//# sourceMappingURL=HTTP11Session.d.ts.map