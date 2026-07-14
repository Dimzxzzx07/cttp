import { CTTPClient } from "./CTTPClient";
import { CTTPRequest } from "./CTTPRequest";
import { CTTPResponse } from "./CTTPResponse";
import { HTTPMethod } from "./HTTPMethod";
import { ConfigTypes } from "../types/ConfigTypes";
import { AuthTypes } from "../types/AuthTypes";
import { BufferUtils } from "../utils/BufferUtils";
import { CryptoUtils } from "../utils/CryptoUtils";
import { Constants } from "./Constants";

export class TokenManager {
  private client: CTTPClient;
  private bufferUtils: BufferUtils;
  private cryptoUtils: CryptoUtils;
  private constants: Constants;
  private config: ConfigTypes.TokenConfig;
  private tokens: Map<string, AuthTypes.Token>;
  private refreshTokens: Map<string, string>;
  private tokenTimers: Map<string, NodeJS.Timeout>;

  constructor(config: ConfigTypes.TokenConfig) {
    this.config = config;
    this.constants = new Constants();
    this.bufferUtils = new BufferUtils();
    this.cryptoUtils = new CryptoUtils();
    this.client = new CTTPClient();
    this.tokens = new Map();
    this.refreshTokens = new Map();
    this.tokenTimers = new Map();
  }

  public async login(
    url: string,
    credentials: AuthTypes.Credentials
  ): Promise<AuthTypes.Token> {
    const request = new CTTPRequest(
      HTTPMethod.LOGIN,
      url,
      { body: credentials }
    );
    
    const response = await this.client.request(request);
    const data = response.getBody();
    
    const token: AuthTypes.Token = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn || 3600,
      tokenType: data.tokenType || "Bearer",
      issuedAt: Date.now()
    };
    
    this.tokens.set("current", token);
    this.refreshTokens.set("current", token.refreshToken);
    this.scheduleRefresh(token);
    
    return token;
  }

  public async logout(url: string, token?: string): Promise<void> {
    const tokenToUse = token || this.getCurrentToken()?.accessToken;
    
    if (!tokenToUse) {
      return;
    }
    
    const request = new CTTPRequest(
      HTTPMethod.LOGOUT,
      url,
      { body: { token: tokenToUse } }
    );
    
    await this.client.request(request);
    
    this.clearTokenTimers();
    this.tokens.delete("current");
    this.refreshTokens.delete("current");
  }

  public async refresh(url: string, refreshToken?: string): Promise<AuthTypes.Token> {
    const tokenToUse = refreshToken || this.refreshTokens.get("current");
    
    if (!tokenToUse) {
      throw new Error("No refresh token available");
    }
    
    const request = new CTTPRequest(
      HTTPMethod.REFRESH,
      url,
      { body: { refreshToken: tokenToUse } }
    );
    
    const response = await this.client.request(request);
    const data = response.getBody();
    
    const token: AuthTypes.Token = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken || tokenToUse,
      expiresIn: data.expiresIn || 3600,
      tokenType: data.tokenType || "Bearer",
      issuedAt: Date.now()
    };
    
    this.tokens.set("current", token);
    this.refreshTokens.set("current", token.refreshToken);
    this.scheduleRefresh(token);
    
    return token;
  }

  private scheduleRefresh(token: AuthTypes.Token): void {
    this.clearTokenTimers();
    
    const refreshTime = (token.expiresIn * 0.8) * 1000;
    const timer = setTimeout(async () => {
      try {
        const url = this.config.refreshUrl || "/token/refresh";
        await this.refresh(url, token.refreshToken);
      } catch (error) {
        this.handleRefreshError(error);
      }
    }, refreshTime);
    
    this.tokenTimers.set("refresh", timer);
  }

  private clearTokenTimers(): void {
    for (const [key, timer] of this.tokenTimers) {
      clearTimeout(timer);
    }
    this.tokenTimers.clear();
  }

  private handleRefreshError(error: any): void {
    this.tokens.delete("current");
    this.refreshTokens.delete("current");
    this.clearTokenTimers();
    this.emit("tokenExpired", error);
  }

  private emit(event: string, data: any): void {
    // Event emission handled by EventEmitter
  }

  public getCurrentToken(): AuthTypes.Token | undefined {
    return this.tokens.get("current");
  }

  public getAccessToken(): string | undefined {
    return this.tokens.get("current")?.accessToken;
  }

  public getRefreshToken(): string | undefined {
    return this.refreshTokens.get("current");
  }

  public isAuthenticated(): boolean {
    return this.tokens.has("current");
  }

  public isExpired(): boolean {
    const token = this.getCurrentToken();
    if (!token) {
      return true;
    }
    const elapsed = (Date.now() - token.issuedAt) / 1000;
    return elapsed >= token.expiresIn;
  }

  public async validateToken(url: string, token?: string): Promise<boolean> {
    const tokenToUse = token || this.getAccessToken();
    if (!tokenToUse) {
      return false;
    }
    
    try {
      const request = new CTTPRequest(
        HTTPMethod.GET,
        `${url}/validate`,
        {
          headers: {
            Authorization: `Bearer ${tokenToUse}`
          }
        }
      );
      
      const response = await this.client.request(request);
      return response.getStatus() === 200;
    } catch {
      return false;
    }
  }

  public async close(): Promise<void> {
    this.clearTokenTimers();
    await this.client.close();
    this.tokens.clear();
    this.refreshTokens.clear();
  }
}