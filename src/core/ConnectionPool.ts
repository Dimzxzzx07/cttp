import { IConnection } from "../interfaces/IConnection";
import { ConfigTypes } from "../types/ConfigTypes";
import { Constants } from "./Constants";
import { Mutex } from "../utils/Mutex";
import { TimerWheel } from "../utils/TimerWheel";

export class ConnectionPool {
  private config: ConfigTypes.PoolConfig;
  private constants: Constants;
  private connections: Map<string, IConnection[]>;
  private activeConnections: Map<string, Set<IConnection>>;
  private mutex: Mutex;
  private timerWheel: TimerWheel;
  private maxConnections: number;
  private idleTimeout: number;
  private connectionTimeout: number;

  constructor(config: ConfigTypes.PoolConfig) {
    this.config = config;
    this.constants = new Constants();
    this.connections = new Map();
    this.activeConnections = new Map();
    this.mutex = new Mutex();
    this.timerWheel = new TimerWheel();
    this.maxConnections = config.maxConnections || 100;
    this.idleTimeout = config.idleTimeout || 60000;
    this.connectionTimeout = config.connectionTimeout || 30000;
  }

  public async acquire(url: string): Promise<IConnection> {
    const key = this.getKey(url);
    await this.mutex.acquire();
    try {
      let pool = this.connections.get(key) || [];
      const active = this.activeConnections.get(key) || new Set();
      
      while (pool.length > 0) {
        const conn = pool.pop()!;
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
    } finally {
      this.mutex.release();
    }
  }

  public release(connection: IConnection): void {
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

  private getKey(url: string): string {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.hostname}:${parsed.port}`;
  }

  private async createConnection(url: string): Promise<IConnection> {
    const parsed = new URL(url);
    const protocol = parsed.protocol.slice(0, -1);
    const hostname = parsed.hostname;
    const port = parseInt(parsed.port) || (protocol === "https" ? 443 : 80);
    
    const connection = await this.connect(protocol, hostname, port);
    return connection;
  }

  private async connect(protocol: string, hostname: string, port: number): Promise<IConnection> {
    const net = require("net");
    const tls = require("tls");
    
    const socket = new net.Socket();
    const promise = new Promise<IConnection>((resolve, reject) => {
      const timeout = setTimeout(() => {
        socket.destroy();
        reject(new Error("Connection timeout"));
      }, this.connectionTimeout);
      
      socket.once("connect", () => {
        clearTimeout(timeout);
        resolve(this.createConnectionObject(socket, protocol, hostname, port));
      });
      
      socket.once("error", (err: any) => {
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
      } else {
        socket.connect(port, hostname);
      }
    });
    
    return promise;
  }

  private createConnectionObject(socket: any, protocol: string, hostname: string, port: number): IConnection {
    return {
      getURL: () => `${protocol}://${hostname}:${port}`,
      isAlive: () => !socket.destroyed,
      write: (data: Buffer) => new Promise((resolve, reject) => {
        socket.write(data, (err: any) => {
          if (err) reject(err);
          else resolve();
        });
      }),
      read: () => new Promise<Buffer>((resolve, reject) => {
        socket.once("data", (data: Buffer) => resolve(data));
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

  private evictIdle(key: string): void {
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

  public async close(): Promise<void> {
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

  public getStats(): any {
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