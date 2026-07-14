import { CTTPError } from "./CTTPError";

export class ValidationError extends CTTPError {
  constructor(message: string, details?: any) {
    super(400, message, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}