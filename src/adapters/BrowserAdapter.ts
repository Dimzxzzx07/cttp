export class BrowserAdapter {
  private fetchAPI: any;
  private WebSocketAPI: any;
  private EventSourceAPI: any;
  private crypto: any;
  private storage: any;

  constructor() {
    this.fetchAPI = typeof fetch !== "undefined" ? fetch : null;
    this.WebSocketAPI = typeof WebSocket !== "undefined" ? WebSocket : null;
    this.EventSourceAPI = typeof EventSource !== "undefined" ? EventSource : null;
    this.crypto = typeof crypto !== "undefined" ? crypto : null;
    this.storage = typeof localStorage !== "undefined" ? localStorage : null;
  }

  public getFetch(): any {
    return this.fetchAPI;
  }

  public getWebSocket(): any {
    return this.WebSocketAPI;
  }

  public getEventSource(): any {
    return this.EventSourceAPI;
  }

  public getCrypto(): any {
    return this.crypto;
  }

  public getStorage(): any {
    return this.storage;
  }

  public getSessionStorage(): any {
    return typeof sessionStorage !== "undefined" ? sessionStorage : null;
  }

  public getNavigator(): any {
    return typeof navigator !== "undefined" ? navigator : null;
  }

  public getLocation(): any {
    return typeof location !== "undefined" ? location : null;
  }

  public getHistory(): any {
    return typeof history !== "undefined" ? history : null;
  }

  public isAvailable(): boolean {
    return typeof window !== "undefined" || typeof self !== "undefined";
  }
}
