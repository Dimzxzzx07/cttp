export class SocketPool {
  private sockets: Map<string, any[]>;
  private maxSize: number;
  private idleTimeout: number;

  constructor(maxSize?: number, idleTimeout?: number) {
    this.sockets = new Map();
    this.maxSize = maxSize || 100;
    this.idleTimeout = idleTimeout || 60000;
  }

  public acquire(key: string): any | null {
    const pool = this.sockets.get(key);
    if (!pool || pool.length === 0) {
      return null;
    }

    const socket = pool.pop()!;
    if (this.isExpired(socket)) {
      this.closeSocket(socket);
      return this.acquire(key);
    }

    return socket;
  }

  public release(key: string, socket: any): void {
    if (!socket || !this.isAlive(socket)) {
      return;
    }

    if (!this.sockets.has(key)) {
      this.sockets.set(key, []);
    }

    const pool = this.sockets.get(key)!;
    if (pool.length < this.maxSize) {
      socket.lastUsed = Date.now();
      pool.push(socket);
    } else {
      this.closeSocket(socket);
    }
  }

  public remove(key: string, socket: any): void {
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

  public createKey(host: string, port: number, protocol: string): string {
    return `${protocol}://${host}:${port}`;
  }

  private isAlive(socket: any): boolean {
    return socket && !socket.destroyed && socket.writable;
  }

  private isExpired(socket: any): boolean {
    return socket.lastUsed && (Date.now() - socket.lastUsed > this.idleTimeout);
  }

  private closeSocket(socket: any): void {
    if (socket && !socket.destroyed) {
      socket.destroy();
    }
  }

  public getSize(key: string): number {
    const pool = this.sockets.get(key);
    return pool ? pool.length : 0;
  }

  public getTotalSize(): number {
    let total = 0;
    for (const pool of this.sockets.values()) {
      total += pool.length;
    }
    return total;
  }

  public clear(): void {
    for (const pool of this.sockets.values()) {
      for (const socket of pool) {
        this.closeSocket(socket);
      }
    }
    this.sockets.clear();
  }

  public getKeys(): string[] {
    return Array.from(this.sockets.keys());
  }

  public setMaxSize(maxSize: number): void {
    this.maxSize = maxSize;
  }

  public getMaxSize(): number {
    return this.maxSize;
  }

  public setIdleTimeout(timeout: number): void {
    this.idleTimeout = timeout;
  }

  public getIdleTimeout(): number {
    return this.idleTimeout;
  }

  public cleanup(): void {
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
      } else {
        this.sockets.delete(key);
      }
    }
  }
}