export interface ILogin {
  login(url: string, credentials: any): Promise<any>;
}