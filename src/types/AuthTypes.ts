export namespace AuthTypes {
  export interface Credentials {
    username?: string;
    email?: string;
    password: string;
    [key: string]: any;
  }

  export interface Token {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
    issuedAt: number;
  }

  export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
  }

  export interface LoginResponse extends AuthResponse {
    user?: any;
    roles?: string[];
    permissions?: string[];
  }
}