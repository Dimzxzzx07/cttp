import { IHTTPRequest } from "./IHTTPRequest";
import { IHTTPResponse } from "./IHTTPResponse";

export interface ITunnel {
  send(request: IHTTPRequest): Promise<IHTTPResponse>;
  close(): Promise<void>;
  healthCheck(): Promise<boolean>;
  getActiveTunnels(): number;
}