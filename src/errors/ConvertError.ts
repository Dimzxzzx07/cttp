import { CTTPError } from "./CTTPError";

export class ConvertError extends CTTPError {
  constructor(message: string, details?: any) {
    super(400, message, "CONVERT_ERROR", details);
    this.name = "ConvertError";
    Object.setPrototypeOf(this, ConvertError.prototype);
  }
}