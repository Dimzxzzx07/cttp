import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
import { CTTPResponse } from "../core/CTTPResponse";
import { HTTPVersion } from "../core/HTTPVersion";

export class LogoutHandler implements IMethodHandler {
  public async handle(request: IHTTPRequest): Promise<IHTTPResponse> {
    const body = request.getBody();
    const token = body?.token || request.getAuthorization();
    
    if (!token) {
      return new CTTPResponse(
        400,
        "Bad Request",
        HTTPVersion.HTTP_1_1,
        new Map([["Content-Type", "application/json"]]),
        { error: "Missing token" }
      );
    }
    
    const isValid = this.validateToken(token);
    if (!isValid) {
      return new CTTPResponse(
        401,
        "Unauthorized",
        HTTPVersion.HTTP_1_1,
        new Map([["Content-Type", "application/json"]]),
        { error: "Invalid token" }
      );
    }
    
    this.invalidateToken(token);
    
    return new CTTPResponse(
      200,
      "OK",
      HTTPVersion.HTTP_1_1,
      new Map([["Content-Type", "application/json"]]),
      { success: true, message: "Logout successful" }
    );
  }
  
  private validateToken(token: string): boolean {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return false;
      const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
      const exp = payload.exp || 0;
      return exp > Math.floor(Date.now() / 1000);
    } catch {
      return false;
    }
  }
  
  private invalidateToken(token: string): void {
    const invalidated = new Set();
    invalidated.add(token);
  }
}