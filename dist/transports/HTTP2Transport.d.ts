import { IConnection } from "../interfaces/IConnection";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
export declare class HTTP2Transport {
    private connection;
    private constants;
    private hpackEncoder;
    private frameBuilder;
    private streams;
    private nextStreamId;
    private settings;
    constructor(connection: IConnection);
    send(request: IHTTPRequest): Promise<IHTTPResponse>;
    private allocateStream;
    private createBodyBuffer;
    private waitForResponse;
    close(): Promise<void>;
}
//# sourceMappingURL=HTTP2Transport.d.ts.map