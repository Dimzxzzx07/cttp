import { IConnection } from "../interfaces/IConnection";
import { Constants } from "../core/Constants";

export class TCPTransport implements IConnection {
  private socket: any;
  private constants: Constants;
  private url: string;
  private connected: boolean;
  private readBuffer: Buffer;
  private writeBuffer: Buffer;

  constructor(host: string, port: number) {
    this.constants = new Constants();
    this.url = `tcp://${host}:${port}`;
    this.connected = false;
    this.readBuffer = Buffer.alloc(0);
    this.writeBuffer = Buffer.alloc(0);
    this.socket = this.createSocket(host, port);
  }

  private createSocket(host: string, port: number): any {
    const net = require("net");
    const socket = new net.Socket();

    socket.on("connect", () => {
      this.connected = true;
    });

    socket.on("data", (data: Buffer) => {
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

  public getURL(): string {
    return this.url;
  }

  public isAlive(): boolean {
    return this.connected && !this.socket.destroyed;
  }

  public async write(data: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isAlive()) {
        reject(new Error("Connection not alive"));
        return;
      }

      this.socket.write(data, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public async read(): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      if (this.readBuffer.length > 0) {
        const data = this.readBuffer;
        this.readBuffer = Buffer.alloc(0);
        resolve(data);
        return;
      }

      const onData = (data: Buffer) => {
        this.socket.removeListener("data", onData);
        this.socket.removeListener("error", onError);
        this.socket.removeListener("end", onEnd);
        this.readBuffer = Buffer.alloc(0);
        resolve(data);
      };

      const onError = (err: any) => {
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

  public async close(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.socket.destroyed) {
        this.socket.destroy();
      }
      this.connected = false;
      resolve();
    });
  }

  public getSocket(): any {
    return this.socket;
  }

  public setTimeout(timeout: number): void {
    this.socket.setTimeout(timeout);
  }

  public getRemoteAddress(): string {
    return this.socket.remoteAddress;
  }

  public getRemotePort(): number {
    return this.socket.remotePort;
  }

  public getLocalAddress(): string {
    return this.socket.localAddress;
  }

  public getLocalPort(): number {
    return this.socket.localPort;
  }
}