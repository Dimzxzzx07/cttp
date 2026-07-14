export declare class BrowserAdapter {
    private fetchAPI;
    private WebSocketAPI;
    private EventSourceAPI;
    private crypto;
    private storage;
    constructor();
    getFetch(): any;
    getWebSocket(): any;
    getEventSource(): any;
    getCrypto(): any;
    getStorage(): any;
    getSessionStorage(): any;
    getNavigator(): any;
    getLocation(): any;
    getHistory(): any;
    isAvailable(): boolean;
}
//# sourceMappingURL=BrowserAdapter.d.ts.map