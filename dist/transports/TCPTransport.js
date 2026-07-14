"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TCPTransport = void 0;
const Constants_1 = require("../core/Constants");
class TCPTransport {
    constructor(host, port) {
        this.constants = new Constants_1.Constants();
        this.url = `tcp://${host}:${port}`;
        this.connected = false;
        this.readBuffer = Buffer.alloc(0);
        this.writeBuffer = Buffer.alloc(0);
        this.socket = this.createSocket(host, port);
    }
    createSocket(host, port) {
        const net = require("net");
        const socket = new net.Socket();
        socket.on("connect", () => {
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
        socket.connect(port, host);
        return socket;
    }
    getURL() {
        return this.url;
    }
    isAlive() {
        return this.connected && !this.socket.destroyed;
    }
    async write(data) {
        return new Promise((resolve, reject) => {
            if (!this.isAlive()) {
                reject(new Error("Connection not alive"));
                return;
            }
            this.socket.write(data, (err) => {
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
                this.socket.removeListener("data", onData);
                this.socket.removeListener("error", onError);
                this.socket.removeListener("end", onEnd);
                this.readBuffer = Buffer.alloc(0);
                resolve(data);
            };
            const onError = (err) => {
                this.socket.removeListener("data", onData);
                this.socket.removeListener("error", onError);
                this.socket.removeListener("end", onEnd);
                reject(err);
            };
            const onEnd = () => {
                this.socket.removeListener("data", onData);
                this.socket.removeListener("error", onError);
                this.socket.removeListener("end", onEnd);
                reject(new Error("Connection ended"));
            };
            this.socket.once("data", onData);
            this.socket.once("error", onError);
            this.socket.once("end", onEnd);
        });
    }
    async close() {
        return new Promise((resolve) => {
            if (!this.socket.destroyed) {
                this.socket.destroy();
            }
            this.connected = false;
            resolve();
        });
    }
    getSocket() {
        return this.socket;
    }
    setTimeout(timeout) {
        this.socket.setTimeout(timeout);
    }
    getRemoteAddress() {
        return this.socket.remoteAddress;
    }
    getRemotePort() {
        return this.socket.remotePort;
    }
    getLocalAddress() {
        return this.socket.localAddress;
    }
    getLocalPort() {
        return this.socket.localPort;
    }
}
exports.TCPTransport = TCPTransport;
//# sourceMappingURL=TCPTransport.js.map