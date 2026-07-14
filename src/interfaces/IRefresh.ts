export interface IRefresh {
  refresh(url: string, refreshToken: string): Promise<any>;
}