"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketPool = void 0;
class SocketPool {
    constructor(maxSize, idleTimeout) {
        this.sockets = new Map();
        this.maxSize = maxSize || 100;
        this.idleTimeout = idleTimeout || 60000;
    }
    acquire(key) {
        const pool = this.sockets.get(key);
        if (!pool || pool.length === 0) {
            return null;
        }
        const socket = pool.pop();
        if (this.isExpired(socket)) {
            this.closeSocket(socket);
            return this.acquire(key);
        }
        return socket;
    }
    release(key, socket) {
        if (!socket || !this.isAlive(socket)) {
            return;
        }
        if (!this.sockets.has(key)) {
            this.sockets.set(key, []);
        }
        const pool = this.sockets.get(key);
        if (pool.length < this.maxSize) {
            socket.lastUsed = Date.now();
            pool.push(socket);
        }
        else {
            this.closeSocket(socket);
        }
    }
    remove(key, socket) {
        const pool = this.sockets.get(key);
        if (!pool) {
            return;
        }
        const index = pool.indexOf(socket);
        if (index !== -1) {
            pool.splice(index, 1);
            this.closeSocket(socket);
        }
    }
    createKey(host, port, protocol) {
        return `${protocol}://${host}:${port}`;
    }
    isAlive(socket) {
        return socket && !socket.destroyed && socket.writable;
    }
    isExpired(socket) {
        return socket.lastUsed && (Date.now() - socket.lastUsed > this.idleTimeout);
    }
    closeSocket(socket) {
        if (socket && !socket.destroyed) {
            socket.destroy();
        }
    }
    getSize(key) {
        const pool = this.sockets.get(key);
        return pool ? pool.length : 0;
    }
    getTotalSize() {
        let total = 0;
        for (const pool of this.sockets.values()) {
            total += pool.length;
        }
        return total;
    }
    clear() {
        for (const pool of this.sockets.values()) {
            for (const socket of pool) {
                this.closeSocket(socket);
            }
        }
        this.sockets.clear();
    }
    getKeys() {
        return Array.from(this.sockets.keys());
    }
    setMaxSize(maxSize) {
        this.maxSize = maxSize;
    }
    getMaxSize() {
        return this.maxSize;
    }
    setIdleTimeout(timeout) {
        this.idleTimeout = timeout;
    }
    getIdleTimeout() {
        return this.idleTimeout;
    }
    cleanup() {
        const now = Date.now();
        for (const [key, pool] of this.sockets) {
            const filtered = pool.filter(socket => {
                if (!this.isAlive(socket) || now - socket.lastUsed > this.idleTimeout) {
                    this.closeSocket(socket);
                    return false;
                }
                return true;
            });
            if (filtered.length > 0) {
                this.sockets.set(key, filtered);
            }
            else {
                this.sockets.delete(key);
            }
        }
    }
}
exports.SocketPool = SocketPool;
//# sourceMappingURL=SocketPool.js.map