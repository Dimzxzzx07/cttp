import { IConnection } from "../interfaces/IConnection";
import { Constants } from "../core/Constants";

export class TLSWrapper implements IConnection {
  private socket: any;
  private tlsSocket: any;
  private constants: Constants;
  private url: string;
  private connected: boolean;
  private readBuffer: Buffer;

  constructor(host: string, port: number, options?: any) {
    this.constants = new Constants();
    this.url = `tls://${host}:${port}`;
    this.connected = false;
    this.readBuffer = Buffer.alloc(0);
    this.tlsSocket = this.createTLSSocket(host, port, options);
  }

  private createTLSSocket(host: string, port: number, options?: any): any {
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

    socket.on("data", (data: Buffer) => {
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

  public getURL(): string {
    return this.url;
  }

  public isAlive(): boolean {
    return this.connected && !this.tlsSocket.destroyed;
  }

  public async write(data: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isAlive()) {
        reject(new Error("Connection not alive"));
        return;
      }

      this.tlsSocket.write(data, (err: any) => {
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
        this.tlsSocket.removeListener("data", onData);
        this.tlsSocket.removeListener("error", onError);
        this.tlsSocket.removeListener("end", onEnd);
        this.readBuffer = Buffer.alloc(0);
        resolve(data);
      };

      const onError = (err: any) => {
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

  public async close(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.tlsSocket.destroyed) {
        this.tlsSocket.destroy();
      }
      this.connected = false;
      resolve();
    });
  }

  public getSocket(): any {
    return this.tlsSocket;
  }

  public getPeerCertificate(): any {
    return this.tlsSocket.getPeerCertificate();
  }

  public getCipher(): any {
    return this.tlsSocket.getCipher();
  }

  public getProtocol(): string {
    return this.tlsSocket.getProtocol();
  }

  public setSecureContext(options: any): void {
    this.tlsSocket.setSecureContext(options);
  }
}