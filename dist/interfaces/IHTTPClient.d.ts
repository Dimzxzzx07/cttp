import { IHTTPRequest } from "./IHTTPRequest";
import { IHTTPResponse } from "./IHTTPResponse";
export interface IHTTPClient {
    request(request: IHTTPRequest): Promise<IHTTPResponse>;
    get(url: string, options?: any): Promise<IHTTPResponse>;
    post(url: string, options?: any): Promise<IHTTPResponse>;
    put(url: string, options?: any): Promise<IHTTPResponse>;
    patch(url: string, options?: any): Promise<IHTTPResponse>;
    delete(url: string, options?: any): Promise<IHTTPResponse>;
    head(url: string, options?: any): Promise<IHTTPResponse>;
    options(url: string, options?: any): Promise<IHTTPResponse>;
    login(url: string, credentials: any): Promise<IHTTPResponse>;
    logout(url: string, token?: string): Promise<IHTTPResponse>;
    refresh(url: string, refreshToken: string): Promise<IHTTPResponse>;
    sync(url: string, options: any): Promise<IHTTPResponse>;
    merge(url: string, options: any): Promise<IHTTPResponse>;
    stream(url: string, options?: any): Promise<IHTTPResponse>;
    upload(url: string, options: any): Promise<IHTTPResponse>;
    convert(url: string, options: any): Promise<IHTTPResponse>;
    archive(url: string, options?: any): Promise<IHTTPResponse>;
    audit(url: string, options?: any): Promise<IHTTPResponse>;
    verify(url: string, options: any): Promise<IHTTPResponse>;
    ping(url: string, options?: any): Promise<IHTTPResponse>;
    notify(url: string, options: any): Promise<IHTTPResponse>;
    undo(url: string, options?: any): Promise<IHTTPResponse>;
    close(): Promise<void>;
    on(event: string, listener: Function): void;
    off(event: string, listener: Function): void;
    emit(event: string, data: any): void;
    getState(): any;
    getConfig(): any;
    setConfig(config: any): void;
}
//# sourceMappingURL=IHTTPClient.d.ts.map