import { ConfigTypes } from "../types/ConfigTypes";
import { AuthTypes } from "../types/AuthTypes";
export declare class TokenManager {
    private client;
    private bufferUtils;
    private cryptoUtils;
    private constants;
    private config;
    private tokens;
    private refreshTokens;
    private tokenTimers;
    constructor(config: ConfigTypes.TokenConfig);
    login(url: string, credentials: AuthTypes.Credentials): Promise<AuthTypes.Token>;
    logout(url: string, token?: string): Promise<void>;
    refresh(url: string, refreshToken?: string): Promise<AuthTypes.Token>;
    private scheduleRefresh;
    private clearTokenTimers;
    private handleRefreshError;
    private emit;
    getCurrentToken(): AuthTypes.Token | undefined;
    getAccessToken(): string | undefined;
    getRefreshToken(): string | undefined;
    isAuthenticated(): boolean;
    isExpired(): boolean;
    validateToken(url: string, token?: string): Promise<boolean>;
    close(): Promise<void>;
}
//# sourceMappingURL=TokenManager.d.ts.map