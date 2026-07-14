import { CTTPError } from "./CTTPError";

export class MethodNotAllowedError extends CTTPError {
  constructor(method: string) {
    super(405, `Method ${method} not allowed`, "METHOD_NOT_ALLOWED", { method });
    this.name = "MethodNotAllowedError";
    Object.setPrototypeOf(this, MethodNotAllowedError.prototype);
  }
}