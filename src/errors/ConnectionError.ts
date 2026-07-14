import { CTTPError } from "./CTTPError";

export class ConnectionError extends CTTPError {
  constructor(message: string, code?: string, details?: any) {
    super(500, message, code || "CONNECTION_ERROR", details);
    this.name = "ConnectionError";
    Object.setPrototypeOf(this, ConnectionError.prototype);
  }
}