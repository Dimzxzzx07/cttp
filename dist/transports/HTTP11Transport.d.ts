import { IConnection } from "../interfaces/IConnection";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
export declare class HTTP11Transport {
    private connection;
    private constants;
    private keepAlive;
    private pipelining;
    private chunkedParser;
    constructor(connection: IConnection);
    send(request: IHTTPRequest): Promise<IHTTPResponse>;
    private buildRequestBuffer;
    private readResponse;
    private parseChunked;
    setKeepAlive(keepAlive: boolean): void;
    setPipelining(pipelining: boolean): void;
    close(): Promise<void>;
}
//# sourceMappingURL=HTTP11Transport.d.ts.map