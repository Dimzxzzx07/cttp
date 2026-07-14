import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
import { CTTPResponse } from "./CTTPResponse";
import { HTTPVersion } from "./HTTPVersion";
import { Constants } from "./Constants";
import { HPACKEncoder } from "./HPACKEncoder";
import { FrameBuilder } from "./FrameBuilder";
import { StreamManager } from "./StreamManager";
import { FlowController } from "./FlowController";

export class HTTP2Session {
  private connection: any;
  private tlsSession: any;
  private constants: Constants;
  private hpackEncoder: HPACKEncoder;
  private frameBuilder: FrameBuilder;
  private streamManager: StreamManager;
  private flowController: FlowController;
  private streams: Map<number, any>;
  private settings: any;

  constructor(connection: any, tlsSession: any) {
    this.connection = connection;
    this.tlsSession = tlsSession;
    this.constants = new Constants();
    this.hpackEncoder = new HPACKEncoder();
    this.frameBuilder = new FrameBuilder();
    this.streamManager = new StreamManager();
    this.flowController = new FlowController();
    this.streams = new Map();
    this.settings = {
      headerTableSize: 4096,
      enablePush: true,
      maxConcurrentStreams: 100,
      initialWindowSize: 65535,
      maxFrameSize: 16384,
      maxHeaderListSize: 65536
    };
  }

  public async send(request: IHTTPRequest): Promise<IHTTPResponse> {
    const streamId = this.streamManager.allocateStream();
    const headers = this.hpackEncoder.encode(request.getHeaders());
    const headerFrame = this.frameBuilder.buildHeaders(streamId, headers, true);
    
    return new Promise((resolve, reject) => {
      const socket = this.connection.getSocket();
      const timeout = setTimeout(() => {
        reject(new Error("Request timeout"));
      }, request.getTimeout() || 30000);
      
      socket.write(headerFrame, (err: any) => {
        if (err) {
          clearTimeout(timeout);
          reject(err);
          return;
        }
        
        const body = request.getBody();
        if (body) {
          const bodyBuffer = this.createBodyBuffer(body);
          const dataFrame = this.frameBuilder.buildData(streamId, bodyBuffer, true);
          socket.write(dataFrame);
        }
        
        this.waitForResponse(streamId, socket, timeout, resolve, reject);
      });
    });
  }

  private createBodyBuffer(body: any): Buffer {
    if (Buffer.isBuffer(body)) {
      return body;
    }
    if (typeof body === "string") {
      return Buffer.from(body);
    }
    return Buffer.from(JSON.stringify(body));
  }

  private waitForResponse(
    streamId: number,
    socket: any,
    timeout: NodeJS.Timeout,
    resolve: Function,
    reject: Function
  ): void {
    const onData = (data: Buffer) => {
      const frames = this.frameBuilder.parse(data);
      for (const frame of frames) {
        if (frame.streamId === streamId) {
          if (frame.type === "headers") {
            const headers = this.hpackEncoder.decode(frame.payload);
            const status = parseInt(headers.get(":status") || "0", 10);
            const statusText = headers.get("status-text") || "";
            const responseHeaders = new Map();
            for (const [key, value] of headers) {
              if (!key.startsWith(":")) {
                responseHeaders.set(key, value);
              }
            }
            this.streams.set(streamId, { headers: responseHeaders, body: Buffer.alloc(0) });
          } else if (frame.type === "data") {
            const stream = this.streams.get(streamId);
            if (stream) {
              stream.body = Buffer.concat([stream.body, frame.payload]);
              this.streams.set(streamId, stream);
            }
          } else if (frame.type === "end_stream") {
            const stream = this.streams.get(streamId);
            if (stream) {
              clearTimeout(timeout);
              socket.removeListener("data", onData);
              const response = new CTTPResponse(
                parseInt(stream.headers.get(":status") || "200", 10),
                stream.headers.get("status-text") || "",
                HTTPVersion.HTTP_2,
                stream.headers,
                stream.body
              );
              this.streams.delete(streamId);
              resolve(response);
            }
          }
        }
      }
    };
    
    socket.on("data", onData);
    socket.on("error", (err: any) => {
      clearTimeout(timeout);
      socket.removeListener("data", onData);
      reject(err);
    });
  }

  public async close(): Promise<void> {
    if (this.connection && this.connection.getSocket()) {
      this.connection.getSocket().destroy();
    }
    this.streams.clear();
  }
}