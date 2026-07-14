export declare class WebSocketUpgrade {
    private connections;
    private protocols;
    private maxFrameSize;
    constructor();
    upgrade(request: any, socket: any): Promise<void>;
    private generateAcceptKey;
    private createWebSocket;
    private buildFrame;
    private buildCloseFrame;
    private handleMessage;
    private parseFrame;
    private generateConnectionId;
    getConnections(): number;
    getProtocols(): string[];
    addProtocol(protocol: string): void;
    removeProtocol(protocol: string): void;
    setMaxFrameSize(size: number): void;
    getMaxFrameSize(): number;
}
//# sourceMappingURL=WebSocketUpgrade.d.ts.map