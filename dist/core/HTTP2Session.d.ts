import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
export declare class HTTP2Session {
    private connection;
    private tlsSession;
    private constants;
    private hpackEncoder;
    private frameBuilder;
    private streamManager;
    private flowController;
    private streams;
    private settings;
    constructor(connection: any, tlsSession: any);
    send(request: IHTTPRequest): Promise<IHTTPResponse>;
    private createBodyBuffer;
    private waitForResponse;
    close(): Promise<void>;
}
//# sourceMappingURL=HTTP2Session.d.ts.map