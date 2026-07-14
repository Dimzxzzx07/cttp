import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
import { CTTPResponse } from "./CTTPResponse";
import { HTTPVersion } from "./HTTPVersion";

export class HTTP3Session {
  private connection: any;
  private quicSession: any;

  constructor(connection: any, quicSession: any) {
    this.connection = connection;
    this.quicSession = quicSession;
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

  public async close(): Promise<void> {}
}
