import { HTTPMethod } from "./HTTPMethod";
import { Constants } from "./Constants";
import { ConfigTypes } from "../types/ConfigTypes";

export class MethodInterceptor {
  private config: ConfigTypes.InterceptorConfig;
  private constants: Constants;
  private customMethods: Set<string>;

  constructor(config: ConfigTypes.InterceptorConfig) {
    this.config = config;
    this.constants = new Constants();
    this.customMethods = new Set([
      "LOGIN",
      "LOGOUT",
      "REFRESH",
      "SYNC",
      "MERGE",
      "STREAM",
      "UPLOAD",
      "CONVERT",
      "ARCHIVE",
      "AUDIT",
      "VERIFY",
      "PING",
      "NOTIFY",
      "UNDO"
    ]);
  }

  public intercept(method: HTTPMethod, headers: Map<string, string>): HTTPMethod {
    const methodStr = method.toString();
    if (this.isCustomMethod(methodStr)) {
      if (this.config.tunnelMode) {
        headers.set("X-HTTP-Method", methodStr);
        return HTTPMethod.POST;
      }
      if (this.config.extensionMode) {
        headers.set("X-HTTP-Method-Extension", methodStr);
        return HTTPMethod.GET;
      }
      return method;
    }
    return method;
  }

  private isCustomMethod(method: string): boolean {
    return this.customMethods.has(method);
  }

  public addCustomMethod(method: string): void {
    this.customMethods.add(method);
  }

  public removeCustomMethod(method: string): void {
    this.customMethods.delete(method);
  }

  public getCustomMethods(): string[] {
    return Array.from(this.customMethods);
  }

  public isMethodSupported(method: string): boolean {
    return this.isCustomMethod(method) || 
           Object.values(HTTPMethod).includes(method as HTTPMethod);
  }
}