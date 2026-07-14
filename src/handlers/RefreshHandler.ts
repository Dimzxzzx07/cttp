import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
import { CTTPResponse } from "../core/CTTPResponse";
import { HTTPVersion } from "../core/HTTPVersion";

export class RefreshHandler implements IMethodHandler {
  private refreshTokens: Map<string, any>;

  constructor() {
    this.refreshTokens = new Map();
  }

  public async handle(request: IHTTPRequest): Promise<IHTTPResponse> {
    const body = request.getBody();
    const refreshToken = body?.refreshToken;
    
    if (!refreshToken) {
      return new CTTPResponse(
        400,
        "Bad Request",
        HTTPVersion.HTTP_1_1,
        new Map([["Content-Type", "application/json"]]),
        { error: "Missing refresh token" }
      );
    }
    
    const isValid = this.validateRefreshToken(refreshToken);
    if (!isValid) {
      return new CTTPResponse(
        401,
        "Unauthorized",
        HTTPVersion.HTTP_1_1,
        new Map([["Content-Type", "application/json"]]),
        { error: "Invalid refresh token" }
      );
    }
    
    const userData = this.getUserData(refreshToken);
    const newAccessToken = this.generateAccessToken(userData);
    const newRefreshToken = this.generateRefreshToken();
    
    this.refreshTokens.set(newRefreshToken, userData);
    this.refreshTokens.delete(refreshToken);
    
    return new CTTPResponse(
      200,
      "OK",
      HTTPVersion.HTTP_1_1,
      new Map([["Content-Type", "application/json"]]),
      {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: 3600,
        tokenType: "Bearer"
      }
    );
  }

  private validateRefreshToken(token: string): boolean {
    return this.refreshTokens.has(token);
  }

  private getUserData(token: string): any {
    return this.refreshTokens.get(token);
  }

  private generateAccessToken(userData: any): string {
    const crypto = require("crypto");
    const payload = {
      ...userData,
      exp: Math.floor(Date.now() / 1000) + 3600
    };
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
    const signature = crypto
      .createHmac("sha256", "secret")
      .update(base64Payload)
      .digest("base64");
    return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${base64Payload}.${signature}`;
  }

  private generateRefreshToken(): string {
    const crypto = require("crypto");
    return crypto.randomBytes(32).toString("hex");
  }
}