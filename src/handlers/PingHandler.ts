import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
import { CTTPResponse } from "../core/CTTPResponse";
import { HTTPVersion } from "../core/HTTPVersion";

export class PingHandler implements IMethodHandler {
  private startTime: number;
  private pingCount: number;

  constructor() {
    this.startTime = Date.now();
    this.pingCount = 0;
  }

  public async handle(request: IHTTPRequest): Promise<IHTTPResponse> {
    this.pingCount++;
    const body = request.getBody();
    const responseBody = {
      status: "ok",
      timestamp: Date.now(),
      uptime: Date.now() - this.startTime,
      pingId: this.generatePingId(),
      count: this.pingCount,
      data: body?.data || null
    };
    
    return new CTTPResponse(
      200,
      "OK",
      HTTPVersion.HTTP_1_1,
      new Map([
        ["Content-Type", "application/json"],
        ["X-Ping-Count", String(this.pingCount)],
        ["X-Ping-Time", String(Date.now())]
      ]),
      responseBody
    );
  }

  private generatePingId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  }

  public getPingCount(): number {
    return this.pingCount;
  }

  public getUptime(): number {
    return Date.now() - this.startTime;
  }

  public reset(): void {
    this.pingCount = 0;
    this.startTime = Date.now();
  }
}