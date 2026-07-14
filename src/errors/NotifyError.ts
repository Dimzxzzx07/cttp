import { CTTPError } from "./CTTPError";

export class NotifyError extends CTTPError {
  constructor(message: string, details?: any) {
    super(400, message, "NOTIFY_ERROR", details);
    this.name = "NotifyError";
    Object.setPrototypeOf(this, NotifyError.prototype);
  }
}