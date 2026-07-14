import { IConnection } from "../interfaces/IConnection";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
import { CTTPResponse } from "../core/CTTPResponse";
import { HTTPVersion } from "../core/HTTPVersion";
import { Constants } from "../core/Constants";

export class HTTP11Transport {
  private connection: IConnection;
  private constants: Constants;
  private keepAlive: boolean;
  private pipelining: boolean;
  private chunkedParser: any;

  constructor(connection: IConnection) {
    this.connection = connection;
    this.constants = new Constants();
    this.keepAlive = true;
    this.pipelining = false;
  }

  public async send(request: IHTTPRequest): Promise<IHTTPResponse> {
    const requestBuffer = this.buildRequestBuffer(request);
    await this.connection.write(requestBuffer);
    return this.readResponse();
  }

  private buildRequestBuffer(request: IHTTPRequest): Buffer {
    const method = request.getMethod();
    const path = request.getPath();
    const version = HTTPVersion.HTTP_1_1;
    const headers = request.getHeaders();
    const body = request.getBody();

    let requestLine = `${method} ${path} ${version}\r\n`;
    let headerString = "";
    for (const [key, value] of headers) {
      headerString += `${key}: ${value}\r\n`;
    }

    let bodyString = "";
    if (body) {
      if (typeof body === "string") {
        bodyString = body;
      } else if (Buffer.isBuffer(body)) {
        bodyString = body.toString();
      } else {
        bodyString = JSON.stringify(body);
      }
    }

    return Buffer.from(`${requestLine}${headerString}\r\n${bodyString}`);
  }

  private async readResponse(): Promise<IHTTPResponse> {
    let buffer = Buffer.alloc(0);
    let headersComplete = false;
    let contentLength = -1;
    let chunked = false;
    let status = 0;
    let statusText = "";
    let headers = new Map<string, string>();
    let body = Buffer.alloc(0);

    return new Promise((resolve, reject) => {
      const readLoop = async () => {
        try {
          while (true) {
            const data = await this.connection.read();
            buffer = Buffer.concat([buffer, data]);

            if (!headersComplete) {
              const headerEnd = buffer.indexOf("\r\n\r\n");
              if (headerEnd !== -1) {
                const headerPart = buffer.subarray(0, headerEnd);
                const bodyPart = buffer.subarray(headerEnd + 4);

                const lines = headerPart.toString().split("\r\n");
                const statusLine = lines[0].split(" ");
                status = parseInt(statusLine[1], 10);
                statusText = statusLine.slice(2).join(" ") || "";

                for (let i = 1; i < lines.length; i++) {
                  const [key, ...valueParts] = lines[i].split(":");
                  if (key && valueParts.length > 0) {
                    headers.set(key.trim(), valueParts.join(":").trim());
                  }
                }

                const contentLengthHeader = headers.get("content-length");
                const transferEncoding = headers.get("transfer-encoding");

                if (contentLengthHeader) {
                  contentLength = parseInt(contentLengthHeader, 10);
                }
                if (transferEncoding && transferEncoding.includes("chunked")) {
                  chunked = true;
                }

                headersComplete = true;
                buffer = bodyPart;

                if (contentLength === 0) {
                  resolve(new CTTPResponse(status, statusText, HTTPVersion.HTTP_1_1, headers, ""));
                  return;
                }
              }
            }

            if (headersComplete) {
              if (chunked) {
                const parsed = this.parseChunked(buffer);
                if (parsed.complete) {
                  body = parsed.body;
                  resolve(new CTTPResponse(status, statusText, HTTPVersion.HTTP_1_1, headers, body));
                  return;
                }
              } else if (contentLength !== -1) {
                if (buffer.length >= contentLength) {
                  body = buffer.subarray(0, contentLength);
                  resolve(new CTTPResponse(status, statusText, HTTPVersion.HTTP_1_1, headers, body));
                  return;
                }
              } else {
                resolve(new CTTPResponse(status, statusText, HTTPVersion.HTTP_1_1, headers, buffer));
                return;
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

  private parseChunked(data: Buffer): any {
    let buffer = data;
    let body = Buffer.alloc(0);
    let complete = false;

    while (buffer.length > 0) {
      const headerEnd = buffer.indexOf("\r\n");
      if (headerEnd === -1) break;

      const header = buffer.subarray(0, headerEnd).toString();
      const chunkSize = parseInt(header, 16);
      buffer = buffer.subarray(headerEnd + 2);

      if (chunkSize === 0) {
        complete = true;
        break;
      }

      if (buffer.length < chunkSize + 2) break;

      const chunk = buffer.subarray(0, chunkSize);
      body = Buffer.concat([body, chunk]);
      buffer = buffer.subarray(chunkSize + 2);
    }

    return { complete, body };
  }

  public setKeepAlive(keepAlive: boolean): void {
    this.keepAlive = keepAlive;
  }

  public setPipelining(pipelining: boolean): void {
    this.pipelining = pipelining;
  }

  public async close(): Promise<void> {
    await this.connection.close();
  }
}