export declare namespace AuthTypes {
    interface Credentials {
        username?: string;
        email?: string;
        password: string;
        [key: string]: any;
    }
    interface Token {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        tokenType: string;
        issuedAt: number;
    }
    interface AuthResponse {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        tokenType: string;
    }
    interface LoginResponse extends AuthResponse {
        user?: any;
        roles?: string[];
        permissions?: string[];
    }
}
//# sourceMappingURL=AuthTypes.d.ts.map