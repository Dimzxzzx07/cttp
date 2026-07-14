/// <reference types="node" />
/// <reference types="node" />
import { ConfigTypes } from "../types/ConfigTypes";
export declare class QUICSession {
    private config;
    private constants;
    private bufferUtils;
    private cryptoUtils;
    private sessions;
    private streams;
    constructor(config: ConfigTypes.QUICConfig);
    createSession(hostname: string, port: number): Promise<any>;
    createStream(session: any): Promise<any>;
    private generateStreamId;
    sendData(stream: any, data: Buffer): Promise<void>;
    receiveData(stream: any): Promise<Buffer>;
    close(): Promise<void>;
}
//# sourceMappingURL=QUICSession.d.ts.map