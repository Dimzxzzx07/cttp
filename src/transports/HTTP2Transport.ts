import { IConnection } from "../interfaces/IConnection";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
import { CTTPResponse } from "../core/CTTPResponse";
import { HTTPVersion } from "../core/HTTPVersion";
import { Constants } from "../core/Constants";
import { HPACKEncoder } from "../core/HPACKEncoder";
import { FrameBuilder } from "../core/FrameBuilder";

export class HTTP2Transport {
  private connection: IConnection;
  private constants: Constants;
  private hpackEncoder: HPACKEncoder;
  private frameBuilder: FrameBuilder;
  private streams: Map<number, any>;
  private nextStreamId: number;
  private settings: any;

  constructor(connection: IConnection) {
    this.connection = connection;
    this.constants = new Constants();
    this.hpackEncoder = new HPACKEncoder();
    this.frameBuilder = new FrameBuilder();
    this.streams = new Map();
    this.nextStreamId = 1;
    this.settings = {
      headerTableSize: 4096,
      enablePush: true,
      maxConcurrentStreams: 100,
      initialWindowSize: 65535,
      maxFrameSize: 16384
    };
  }

  public async send(request: IHTTPRequest): Promise<IHTTPResponse> {
    const streamId = this.allocateStream();
    const headers = request.getHeaders();
    const encodedHeaders = this.hpackEncoder.encode(headers);
    const headerFrame = this.frameBuilder.buildHeaders(streamId, encodedHeaders, true);

    await this.connection.write(headerFrame);

    const body = request.getBody();
    if (body) {
      const bodyBuffer = this.createBodyBuffer(body);
      const dataFrame = this.frameBuilder.buildData(streamId, bodyBuffer, true);
      await this.connection.write(dataFrame);
    }

    return this.waitForResponse(streamId);
  }

  private allocateStream(): number {
    const id = this.nextStreamId;
    this.nextStreamId += 2;
    this.streams.set(id, { headers: new Map(), body: Buffer.alloc(0), complete: false });
    return id;
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

  private async waitForResponse(streamId: number): Promise<IHTTPResponse> {
    return new Promise((resolve, reject) => {
      const readLoop = async () => {
        try {
          while (true) {
            const data = await this.connection.read();
            const frames = this.frameBuilder.parse(data);

            for (const frame of frames) {
              if (frame.streamId === streamId) {
                const stream = this.streams.get(streamId);
                if (!stream) continue;

                if (frame.type === "headers") {
                  const headers = this.hpackEncoder.decode(frame.payload);
                  for (const [key, value] of headers) {
                    stream.headers.set(key, value);
                  }
                } else if (frame.type === "data") {
                  stream.body = Buffer.concat([stream.body, frame.payload]);
                } else if (frame.type === "end_stream" || (frame.flags & 0x01)) {
                  stream.complete = true;
                  const status = parseInt(stream.headers.get(":status") || "200", 10);
                  const statusText = stream.headers.get("status-text") || "";
                  const response = new CTTPResponse(
                    status,
                    statusText,
                    HTTPVersion.HTTP_2,
                    stream.headers,
                    stream.body
                  );
                  this.streams.delete(streamId);
                  resolve(response);
                  return;
                }
              }
            }
          }
        } catch (error) {
          reject(error);
        }
      };

      readLoop();
    });
  }

  public async close(): Promise<void> {
    await this.connection.close();
    this.streams.clear();
  }
}