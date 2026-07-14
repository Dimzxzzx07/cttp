"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserAdapter = void 0;
class BrowserAdapter {
    constructor() {
        this.fetchAPI = typeof fetch !== "undefined" ? fetch : null;
        this.WebSocketAPI = typeof WebSocket !== "undefined" ? WebSocket : null;
        this.EventSourceAPI = typeof EventSource !== "undefined" ? EventSource : null;
        this.crypto = typeof crypto !== "undefined" ? crypto : null;
        this.storage = typeof localStorage !== "undefined" ? localStorage : null;
    }
    getFetch() {
        return this.fetchAPI;
    }
    getWebSocket() {
        return this.WebSocketAPI;
    }
    getEventSource() {
        return this.EventSourceAPI;
    }
    getCrypto() {
        return this.crypto;
    }
    getStorage() {
        return this.storage;
    }
    getSessionStorage() {
        return typeof sessionStorage !== "undefined" ? sessionStorage : null;
    }
    getNavigator() {
        return typeof navigator !== "undefined" ? navigator : null;
    }
    getLocation() {
        return typeof location !== "undefined" ? location : null;
    }
    getHistory() {
        return typeof history !== "undefined" ? history : null;
    }
    isAvailable() {
        return typeof window !== "undefined" || typeof self !== "undefined";
    }
}
exports.BrowserAdapter = BrowserAdapter;
//# sourceMappingURL=BrowserAdapter.js.map