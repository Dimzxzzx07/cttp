import { IConnection } from "../interfaces/IConnection";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
import { CTTPResponse } from "../core/CTTPResponse";
import { HTTPVersion } from "../core/HTTPVersion";

export class HTTP3Transport {
  private connection: IConnection;

  constructor(connection: IConnection) {
    this.connection = connection;
  }

  public async send(request: IHTTPRequest): Promise<IHTTPResponse> {
    const headers = request.getHeaders();
    const headerObj: Record<string, string> = {};
    for (const [key, value] of headers) {
      headerObj[key] = value;
    }
    const headerData = Buffer.from(JSON.stringify(headerObj));
    return new CTTPResponse(200, "OK", HTTPVersion.HTTP_3, new Map(), headerData);
  }

  public async close(): Promise<void> {
    await this.connection.close();
  }
}
