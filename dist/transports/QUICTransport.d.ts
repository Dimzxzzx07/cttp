import { IConnection } from "../interfaces/IConnection";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
export declare class QUICTransport {
    private connection;
    private constants;
    private quicSession;
    private streams;
    constructor(connection: IConnection);
    send(request: IHTTPRequest): Promise<IHTTPResponse>;
    private generateStreamId;
    private createStream;
    private buildRequestBuffer;
    private sendData;
    private receiveData;
    private parseResponse;
    close(): Promise<void>;
    getStream(streamId: string): any;
    getStreams(): string[];
    removeStream(streamId: string): void;
}
//# sourceMappingURL=QUICTransport.d.ts.map