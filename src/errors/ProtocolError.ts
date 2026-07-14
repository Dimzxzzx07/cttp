import { CTTPError } from "./CTTPError";

export class ProtocolError extends CTTPError {
  constructor(message: string, code?: string, details?: any) {
    super(400, message, code || "PROTOCOL_ERROR", details);
    this.name = "ProtocolError";
    Object.setPrototypeOf(this, ProtocolError.prototype);
  }
}