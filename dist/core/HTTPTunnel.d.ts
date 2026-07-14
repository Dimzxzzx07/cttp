import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
import { ConfigTypes } from "../types/ConfigTypes";
export declare class HTTPTunnel {
    private connectionPool;
    private tlsSession;
    private bufferUtils;
    private cryptoUtils;
    private constants;
    private config;
    private sessions;
    private activeTunnels;
    constructor(config: ConfigTypes.TunnelConfig);
    send(request: IHTTPRequest): Promise<IHTTPResponse>;
    private generateTunnelId;
    private createTunnelRequest;
    private buildTunnelFrame;
    private parseTunnelResponse;
    private encryptPayload;
    private decryptPayload;
    close(): Promise<void>;
    healthCheck(): Promise<boolean>;
    getActiveTunnels(): number;
    getSession(tunnelId: string): any;
    removeSession(tunnelId: string): void;
}
//# sourceMappingURL=HTTPTunnel.d.ts.map