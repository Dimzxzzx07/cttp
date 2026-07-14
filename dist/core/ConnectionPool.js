"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionPool = void 0;
const Constants_1 = require("./Constants");
const Mutex_1 = require("../utils/Mutex");
const TimerWheel_1 = require("../utils/TimerWheel");
class ConnectionPool {
    constructor(config) {
        this.config = config;
        this.constants = new Constants_1.Constants();
        this.connections = new Map();
        this.activeConnections = new Map();
        this.mutex = new Mutex_1.Mutex();
        this.timerWheel = new TimerWheel_1.TimerWheel();
        this.maxConnections = config.maxConnections || 100;
        this.idleTimeout = config.idleTimeout || 60000;
        this.connectionTimeout = config.connectionTimeout || 30000;
    }
    async acquire(url) {
        const key = this.getKey(url);
        await this.mutex.acquire();
        try {
            let pool = this.connections.get(key) || [];
            const active = this.activeConnections.get(key) || new Set();
            while (pool.length > 0) {
                const conn = pool.pop();
                if (conn.isAlive()) {
                    active.add(conn);
                    this.activeConnections.set(key, active);
                    return conn;
                }
            }
            if (active.size < this.maxConnections) {
                const conn = await this.createConnection(url);
                active.add(conn);
                this.activeConnections.set(key, active);
                return conn;
            }
            throw new Error("Connection pool exhausted");
        }
        finally {
            this.mutex.release();
        }
    }
    release(connection) {
        const key = this.getKey(connection.getURL());
        const active = this.activeConnections.get(key);
        if (active) {
            active.delete(connection);
            if (connection.isAlive()) {
                const pool = this.connections.get(key) || [];
                pool.push(connection);
                this.connections.set(key, pool);
                this.timerWheel.schedule(() => this.evictIdle(key), this.idleTimeout);
            }
        }
    }
    getKey(url) {
        const parsed = new URL(url);
        return `${parsed.protocol}//${parsed.hostname}:${parsed.port}`;
    }
    async createConnection(url) {
        const parsed = new URL(url);
        const protocol = parsed.protocol.slice(0, -1);
        const hostname = parsed.hostname;
        const port = parseInt(parsed.port) || (protocol === "https" ? 443 : 80);
        const connection = await this.connect(protocol, hostname, port);
        return connection;
    }
    async connect(protocol, hostname, port) {
        const net = require("net");
        const tls = require("tls");
        const socket = new net.Socket();
        const promise = new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                socket.destroy();
                reject(new Error("Connection timeout"));
            }, this.connectionTimeout);
            socket.once("connect", () => {
                clearTimeout(timeout);
                resolve(this.createConnectionObject(socket, protocol, hostname, port));
            });
            socket.once("error", (err) => {
                clearTimeout(timeout);
                reject(err);
            });
            if (protocol === "https") {
                const tlsSocket = tls.connect({
                    socket: socket,
                    host: hostname,
                    port: port,
                    rejectUnauthorized: false
                });
                socket.connect(port, hostname);
            }
            else {
                socket.connect(port, hostname);
            }
        });
        return promise;
    }
    createConnectionObject(socket, protocol, hostname, port) {
        return {
            getURL: () => `${protocol}://${hostname}:${port}`,
            isAlive: () => !socket.destroyed,
            write: (data) => new Promise((resolve, reject) => {
                socket.write(data, (err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            }),
            read: () => new Promise((resolve, reject) => {
                socket.once("data", (data) => resolve(data));
                socket.once("error", reject);
                socket.once("end", () => reject(new Error("Connection ended")));
            }),
            close: () => new Promise((resolve) => {
                socket.destroy();
                resolve();
            }),
            getSocket: () => socket
        };
    }
    evictIdle(key) {
        const pool = this.connections.get(key) || [];
        const now = Date.now();
        const cutoff = now - this.idleTimeout;
        while (pool.length > 0) {
            const conn = pool[pool.length - 1];
            if (conn.isAlive()) {
                break;
            }
            pool.pop();
        }
        this.connections.set(key, pool);
    }
    async close() {
        for (const [key, pool] of this.connections) {
            for (const conn of pool) {
                await conn.close();
            }
        }
        for (const [key, active] of this.activeConnections) {
            for (const conn of active) {
                await conn.close();
            }
        }
        this.connections.clear();
        this.activeConnections.clear();
        this.timerWheel.clear();
    }
    getStats() {
        let totalConnections = 0;
        let activeConnections = 0;
        for (const pool of this.connections.values()) {
            totalConnections += pool.length;
        }
        for (const active of this.activeConnections.values()) {
            activeConnections += active.size;
        }
        return {
            totalConnections,
            activeConnections,
            idleConnections: totalConnections,
            pools: this.connections.size
        };
    }
}
exports.ConnectionPool = ConnectionPool;
//# sourceMappingURL=ConnectionPool.js.map