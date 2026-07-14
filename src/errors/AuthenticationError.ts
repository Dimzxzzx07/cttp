import { CTTPError } from "./CTTPError";

export class AuthenticationError extends CTTPError {
  constructor(message: string, details?: any) {
    super(401, message, "AUTHENTICATION_ERROR", details);
    this.name = "AuthenticationError";
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}