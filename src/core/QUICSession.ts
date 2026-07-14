import { ConfigTypes } from "../types/ConfigTypes";
import { Constants } from "./Constants";
import { BufferUtils } from "../utils/BufferUtils";
import { CryptoUtils } from "../utils/CryptoUtils";

export class QUICSession {
  private config: ConfigTypes.QUICConfig;
  private constants: Constants;
  private bufferUtils: BufferUtils;
  private cryptoUtils: CryptoUtils;
  private sessions: Map<string, any>;
  private streams: Map<string, any>;

  constructor(config: ConfigTypes.QUICConfig) {
    this.config = config;
    this.constants = new Constants();
    this.bufferUtils = new BufferUtils();
    this.cryptoUtils = new CryptoUtils();
    this.sessions = new Map();
    this.streams = new Map();
  }

  public async createSession(hostname: string, port: number): Promise<any> {
    const quic = require("quic");
    const key = `${hostname}:${port}`;
    
    if (this.sessions.has(key)) {
      return this.sessions.get(key);
    }
    
    const session = quic.connect({
      host: hostname,
      port: port,
      alpn: this.config.alpn || ["h3"],
      maxIncomingStreams: this.config.maxStreams || 100
    });
    
    this.sessions.set(key, session);
    return session;
  }

  public async createStream(session: any): Promise<any> {
    const stream = session.createStream({
      type: "bidirectional",
      priority: 0
    });
    const id = this.generateStreamId();
    this.streams.set(id, stream);
    return stream;
  }

  private generateStreamId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  public async sendData(stream: any, data: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      stream.write(data, (err: any) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  public async receiveData(stream: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      stream.once("data", (data: Buffer) => resolve(data));
      stream.once("error", reject);
      stream.once("end", () => reject(new Error("Stream ended")));
    });
  }

  public async close(): Promise<void> {
    for (const [key, session] of this.sessions) {
      session.close();
    }
    this.sessions.clear();
    this.streams.clear();
  }
}