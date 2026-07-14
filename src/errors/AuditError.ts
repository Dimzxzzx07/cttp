import { CTTPError } from "./CTTPError";

export class AuditError extends CTTPError {
  constructor(message: string, details?: any) {
    super(400, message, "AUDIT_ERROR", details);
    this.name = "AuditError";
    Object.setPrototypeOf(this, AuditError.prototype);
  }
}