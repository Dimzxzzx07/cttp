import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
import { CTTPRequest } from "./CTTPRequest";
import { CTTPResponse } from "./CTTPResponse";
import { HTTPMethod } from "./HTTPMethod";
import { HTTPVersion } from "./HTTPVersion";
import { ConnectionPool } from "./ConnectionPool";
import { TLSSession } from "./TLSSession";
import { HeaderBuilder } from "../utils/HeaderBuilder";
import { BufferUtils } from "../utils/BufferUtils";
import { CryptoUtils } from "../utils/CryptoUtils";
import { ConfigTypes } from "../types/ConfigTypes";
import { Constants } from "./Constants";

export class HTTPTunnel {
  private connectionPool: ConnectionPool;
  private tlsSession: TLSSession;
  private bufferUtils: BufferUtils;
  private cryptoUtils: CryptoUtils;
  private constants: Constants;
  private config: ConfigTypes.TunnelConfig;
  private sessions: Map<string, any>;
  private activeTunnels: Map<string, boolean>;

  constructor(config: ConfigTypes.TunnelConfig) {
    this.config = config;
    this.constants = new Constants();
    this.bufferUtils = new BufferUtils();
    this.cryptoUtils = new CryptoUtils();
    this.sessions = new Map();
    this.activeTunnels = new Map();
    this.connectionPool = new ConnectionPool(config.poolConfig);
    this.tlsSession = new TLSSession(config.tlsConfig);
  }

  public async send(request: IHTTPRequest): Promise<IHTTPResponse> {
    const tunnelId = this.generateTunnelId();
    const connection = await this.connectionPool.acquire(request.getURL());
    const tunnelRequest = this.createTunnelRequest(request, tunnelId);
    const rawBuffer = tunnelRequest.toBuffer();
    const encryptedBuffer = await this.encryptPayload(rawBuffer);
    const tunnelFrame = this.buildTunnelFrame(encryptedBuffer, tunnelId);
    await connection.write(tunnelFrame);
    const responseBuffer = await connection.read();
    const decryptedBuffer = await this.decryptPayload(responseBuffer);
    const response = this.parseTunnelResponse(decryptedBuffer);
    this.connectionPool.release(connection);
    this.activeTunnels.delete(tunnelId);
    return response;
  }

  private generateTunnelId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  private createTunnelRequest(request: IHTTPRequest, tunnelId: string): CTTPRequest {
    const tunnelRequest = new CTTPRequest(
      HTTPMethod.POST,
      "/tunnel",
      {
        headers: {
          "X-Tunnel-ID": tunnelId,
          "X-Tunnel-Method": request.getMethod(),
          "X-Tunnel-URL": request.getURL(),
          "X-Tunnel-Version": request.getVersion(),
          "Content-Type": "application/octet-stream"
        },
        body: request.toBuffer().toString("base64"),
        tunnel: false,
        version: HTTPVersion.HTTP_1_1
      }
    );
    return tunnelRequest;
  }

  private buildTunnelFrame(payload: Buffer, tunnelId: string): Buffer {
    const header = Buffer.alloc(20);
    header.writeUInt32BE(this.constants.TUNNEL_MAGIC, 0);
    header.writeUInt16BE(this.constants.TUNNEL_VERSION, 4);
    header.writeUInt32BE(payload.length, 6);
    header.write(tunnelId, 10, 10, "ascii");
    return Buffer.concat([header, payload]);
  }

  private parseTunnelResponse(buffer: Buffer): CTTPResponse {
    const header = buffer.subarray(0, 20);
    const magic = header.readUInt32BE(0);
    const version = header.readUInt16BE(4);
    const length = header.readUInt32BE(6);
    const tunnelId = header.subarray(10, 20).toString("ascii");
    const payload = buffer.subarray(20, 20 + length);
    const responseData = JSON.parse(payload.toString());
    const headers = new Map();
    for (const [key, value] of Object.entries(responseData.headers)) {
      headers.set(key, value as string);
    }
    const response = new CTTPResponse(
      responseData.status,
      responseData.statusText,
      responseData.version,
      headers,
      responseData.body
    );
    return response;
  }

  private async encryptPayload(payload: Buffer): Promise<Buffer> {
    if (!this.config.encrypt) {
      return payload;
    }
    const key = Buffer.from(this.config.encryptionKey, "hex");
    const iv = this.cryptoUtils.generateIV();
    const encrypted = this.cryptoUtils.encryptAESGCM(payload, key, iv);
    return Buffer.concat([iv, encrypted]);
  }

  private async decryptPayload(payload: Buffer): Promise<Buffer> {
    if (!this.config.encrypt) {
      return payload;
    }
    const key = Buffer.from(this.config.encryptionKey, "hex");
    const iv = payload.subarray(0, 12);
    const encrypted = payload.subarray(12);
    return this.cryptoUtils.decryptAESGCM(encrypted, key, iv);
  }

  public async close(): Promise<void> {
    await this.connectionPool.close();
    await this.tlsSession.close();
    this.sessions.clear();
    this.activeTunnels.clear();
  }

  public async healthCheck(): Promise<boolean> {
    try {
      const testId = this.generateTunnelId();
      const testPayload = Buffer.from("ping");
      const frame = this.buildTunnelFrame(testPayload, testId);
      return true;
    } catch {
      return false;
    }
  }

  public getActiveTunnels(): number {
    return this.activeTunnels.size;
  }

  public getSession(tunnelId: string): any {
    return this.sessions.get(tunnelId);
  }

  public removeSession(tunnelId: string): void {
    this.sessions.delete(tunnelId);
    this.activeTunnels.delete(tunnelId);
  }
}