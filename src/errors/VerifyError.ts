import { CTTPError } from "./CTTPError";

export class VerifyError extends CTTPError {
  constructor(message: string, details?: any) {
    super(400, message, "VERIFY_ERROR", details);
    this.name = "VerifyError";
    Object.setPrototypeOf(this, VerifyError.prototype);
  }
}