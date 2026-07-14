import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
import { CTTPResponse } from "../core/CTTPResponse";
import { HTTPVersion } from "../core/HTTPVersion";

export class LoginHandler implements IMethodHandler {
  public async handle(request: IHTTPRequest): Promise<IHTTPResponse> {
    const body = request.getBody();
    const credentials = body || {};
    const username = credentials.username || credentials.email;
    const password = credentials.password;
    
    if (!username || !password) {
      return new CTTPResponse(
        400,
        "Bad Request",
        HTTPVersion.HTTP_1_1,
        new Map([["Content-Type", "application/json"]]),
        { error: "Missing credentials" }
      );
    }
    
    const token = this.generateToken(username);
    const refreshToken = this.generateRefreshToken(username);
    const expiresIn = 3600;
    
    return new CTTPResponse(
      200,
      "OK",
      HTTPVersion.HTTP_1_1,
      new Map([["Content-Type", "application/json"]]),
      {
        accessToken: token,
        refreshToken: refreshToken,
        expiresIn: expiresIn,
        tokenType: "Bearer"
      }
    );
  }
  
  private generateToken(username: string): string {
    const crypto = require("crypto");
    const payload = {
      username,
      exp: Math.floor(Date.now() / 1000) + 3600
    };
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
    const signature = crypto
      .createHmac("sha256", "secret")
      .update(base64Payload)
      .digest("base64");
    return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${base64Payload}.${signature}`;
  }
  
  private generateRefreshToken(username: string): string {
    const crypto = require("crypto");
    return crypto.randomBytes(32).toString("hex");
  }
}