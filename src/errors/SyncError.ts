import { CTTPError } from "./CTTPError";

export class SyncError extends CTTPError {
  constructor(message: string, details?: any) {
    super(400, message, "SYNC_ERROR", details);
    this.name = "SyncError";
    Object.setPrototypeOf(this, SyncError.prototype);
  }
}