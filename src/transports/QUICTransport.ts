import { IConnection } from "../interfaces/IConnection";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
import { CTTPResponse } from "../core/CTTPResponse";
import { HTTPVersion } from "../core/HTTPVersion";
import { Constants } from "../core/Constants";

export class QUICTransport {
  private connection: IConnection;
  private constants: Constants;
  private quicSession: any;
  private streams: Map<string, any>;

  constructor(connection: IConnection) {
    this.connection = connection;
    this.constants = new Constants();
    this.streams = new Map();
  }

  public async send(request: IHTTPRequest): Promise<IHTTPResponse> {
    const streamId = this.generateStreamId();
    const stream = await this.createStream(streamId);
    const requestBuffer = this.buildRequestBuffer(request);

    await this.sendData(stream, requestBuffer);
    const responseData = await this.receiveData(stream);

    return this.parseResponse(responseData);
  }

  private generateStreamId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  private async createStream(streamId: string): Promise<any> {
    const stream = {
      id: streamId,
      data: Buffer.alloc(0),
      complete: false
    };
    this.streams.set(streamId, stream);
    return stream;
  }

  private buildRequestBuffer(request: IHTTPRequest): Buffer {
    const method = request.getMethod();
    const url = request.getURL();
    const headers = request.getHeaders();
    const body = request.getBody();

    let requestString = `${method} ${url} HTTP/3\r\n`;
    for (const [key, value] of headers) {
      requestString += `${key}: ${value}\r\n`;
    }
    requestString += "\r\n";

    if (body) {
      if (typeof body === "string") {
        requestString += body;
      } else if (Buffer.isBuffer(body)) {
        requestString += body.toString();
      } else {
        requestString += JSON.stringify(body);
      }
    }

    return Buffer.from(requestString);
  }

  private async sendData(stream: any, data: Buffer): Promise<void> {
    await this.connection.write(data);
  }

  private async receiveData(stream: any): Promise<Buffer> {
    const data = await this.connection.read();
    stream.data = Buffer.concat([stream.data, data]);
    return stream.data;
  }

  private parseResponse(data: Buffer): IHTTPResponse {
    const text = data.toString();
    const lines = text.split("\r\n");
    const statusLine = lines[0].split(" ");
    const status = parseInt(statusLine[1], 10);
    const statusText = statusLine.slice(2).join(" ") || "";

    const headers = new Map<string, string>();
    let bodyIndex = 0;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === "") {
        bodyIndex = i + 1;
        break;
      }
      const [key, ...valueParts] = lines[i].split(":");
      if (key && valueParts.length > 0) {
        headers.set(key.trim(), valueParts.join(":").trim());
      }
    }

    const body = lines.slice(bodyIndex).join("\r\n");

    return new CTTPResponse(
      status,
      statusText,
      HTTPVersion.HTTP_3,
      headers,
      body
    );
  }

  public async close(): Promise<void> {
    await this.connection.close();
    this.streams.clear();
  }

  public getStream(streamId: string): any {
    return this.streams.get(streamId);
  }

  public getStreams(): string[] {
    return Array.from(this.streams.keys());
  }

  public removeStream(streamId: string): void {
    this.streams.delete(streamId);
  }
}