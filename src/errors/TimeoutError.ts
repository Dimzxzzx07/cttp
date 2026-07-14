import { CTTPError } from "./CTTPError";

export class TimeoutError extends CTTPError {
  constructor(message: string, code?: string, details?: any) {
    super(408, message, code || "TIMEOUT_ERROR", details);
    this.name = "TimeoutError";
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}