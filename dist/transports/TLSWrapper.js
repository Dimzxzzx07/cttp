"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TLSWrapper = void 0;
const Constants_1 = require("../core/Constants");
class TLSWrapper {
    constructor(host, port, options) {
        this.constants = new Constants_1.Constants();
        this.url = `tls://${host}:${port}`;
        this.connected = false;
        this.readBuffer = Buffer.alloc(0);
        this.tlsSocket = this.createTLSSocket(host, port, options);
    }
    createTLSSocket(host, port, options) {
        const tls = require("tls");
        const socket = tls.connect({
            host: host,
            port: port,
            rejectUnauthorized: options?.rejectUnauthorized !== false,
            minVersion: options?.minVersion || "TLSv1.2",
            maxVersion: options?.maxVersion || "TLSv1.3"
        });
        socket.on("secureConnect", () => {
            this.connected = true;
        });
        socket.on("data", (data) => {
            this.readBuffer = Buffer.concat([this.readBuffer, data]);
        });
        socket.on("error", () => {
            this.connected = false;
        });
        socket.on("close", () => {
            this.connected = false;
        });
        return socket;
    }
    getURL() {
        return this.url;
    }
    isAlive() {
        return this.connected && !this.tlsSocket.destroyed;
    }
    async write(data) {
        return new Promise((resolve, reject) => {
            if (!this.isAlive()) {
                reject(new Error("Connection not alive"));
                return;
            }
            this.tlsSocket.write(data, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    async read() {
        return new Promise((resolve, reject) => {
            if (this.readBuffer.length > 0) {
                const data = this.readBuffer;
                this.readBuffer = Buffer.alloc(0);
                resolve(data);
                return;
            }
            const onData = (data) => {
                this.tlsSocket.removeListener("data", onData);
                this.tlsSocket.removeListener("error", onError);
                this.tlsSocket.removeListener("end", onEnd);
                this.readBuffer = Buffer.alloc(0);
                resolve(data);
            };
            const onError = (err) => {
                this.tlsSocket.removeListener("data", onData);
                this.tlsSocket.removeListener("error", onError);
                this.tlsSocket.removeListener("end", onEnd);
                reject(err);
            };
            const onEnd = () => {
                this.tlsSocket.removeListener("data", onData);
                this.tlsSocket.removeListener("error", onError);
                this.tlsSocket.removeListener("end", onEnd);
                reject(new Error("Connection ended"));
            };
            this.tlsSocket.once("data", onData);
            this.tlsSocket.once("error", onError);
            this.tlsSocket.once("end", onEnd);
        });
    }
    async close() {
        return new Promise((resolve) => {
            if (!this.tlsSocket.destroyed) {
                this.tlsSocket.destroy();
            }
            this.connected = false;
            resolve();
        });
    }
    getSocket() {
        return this.tlsSocket;
    }
    getPeerCertificate() {
        return this.tlsSocket.getPeerCertificate();
    }
    getCipher() {
        return this.tlsSocket.getCipher();
    }
    getProtocol() {
        return this.tlsSocket.getProtocol();
    }
    setSecureContext(options) {
        this.tlsSocket.setSecureContext(options);
    }
}
exports.TLSWrapper = TLSWrapper;
//# sourceMappingURL=TLSWrapper.js.map