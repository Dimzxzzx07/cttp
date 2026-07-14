import { CTTPError } from "./CTTPError";

export class UploadError extends CTTPError {
  constructor(message: string, details?: any) {
    super(400, message, "UPLOAD_ERROR", details);
    this.name = "UploadError";
    Object.setPrototypeOf(this, UploadError.prototype);
  }
}