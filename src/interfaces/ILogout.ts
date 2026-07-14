export interface ILogout {
  logout(url: string, token?: string): Promise<void>;
}