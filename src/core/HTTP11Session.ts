import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
import { CTTPResponse } from "./CTTPResponse";
import { HTTPVersion } from "./HTTPVersion";
import { Constants } from "./Constants";
import { HeaderBuilder } from "../utils/HeaderBuilder";
import { ChunkedStreamParser } from "./ChunkedStreamParser";

export class HTTP11Session {
  private connection: any;
  private tlsSession: any;
  private constants: Constants;
  private chunkedParser: ChunkedStreamParser;
  private keepAlive: boolean;
  private pipelining: boolean;

  constructor(connection: any, tlsSession: any) {
    this.connection = connection;
    this.tlsSession = tlsSession;
    this.constants = new Constants();
    this.chunkedParser = new ChunkedStreamParser();
    this.keepAlive = true;
    this.pipelining = false;
  }

  public async send(request: IHTTPRequest): Promise<IHTTPResponse> {
    const socket = this.connection.getSocket();
    const requestBuffer = this.buildRequestBuffer(request);
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Request timeout"));
      }, request.getTimeout() || 30000);
      
      socket.write(requestBuffer, async (err: any) => {
        if (err) {
          clearTimeout(timeout);
          reject(err);
          return;
        }
        
        try {
          const response = await this.readResponse(socket);
          clearTimeout(timeout);
          resolve(response);
        } catch (error) {
          clearTimeout(timeout);
          reject(error);
        }
      });
    });
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
    
    const fullRequest = `${requestLine}${headerString}\r\n${bodyString}`;
    return Buffer.from(fullRequest);
  }

  private async readResponse(socket: any): Promise<IHTTPResponse> {
    let buffer = Buffer.alloc(0);
    let headersComplete = false;
    let contentLength = -1;
    let chunked = false;
    let status = 0;
    let statusText = "";
    let headers = new Map<string, string>();
    let body = Buffer.alloc(0);
    
    return new Promise((resolve, reject) => {
      const onData = (data: Buffer) => {
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
              socket.removeListener("data", onData);
              return;
            }
          }
        }
        
        if (headersComplete) {
          if (chunked) {
            const parsed = this.chunkedParser.parse(buffer);
            if (parsed.complete) {
              body = parsed.body;
              resolve(new CTTPResponse(status, statusText, HTTPVersion.HTTP_1_1, headers, body));
              socket.removeListener("data", onData);
            }
          } else if (contentLength !== -1) {
            if (buffer.length >= contentLength) {
              body = buffer.subarray(0, contentLength);
              resolve(new CTTPResponse(status, statusText, HTTPVersion.HTTP_1_1, headers, body));
              socket.removeListener("data", onData);
            }
          }
        }
      };
      
      socket.on("data", onData);
      socket.on("error", (err: any) => {
        socket.removeListener("data", onData);
        reject(err);
      });
      socket.on("end", () => {
        socket.removeListener("data", onData);
        if (!headersComplete) {
          reject(new Error("Connection closed before headers complete"));
        }
      });
    });
  }

  public async close(): Promise<void> {
    if (this.connection && this.connection.getSocket()) {
      this.connection.getSocket().destroy();
    }
  }

  public setKeepAlive(keepAlive: boolean): void {
    this.keepAlive = keepAlive;
  }

  public setPipelining(pipelining: boolean): void {
    this.pipelining = pipelining;
  }
}