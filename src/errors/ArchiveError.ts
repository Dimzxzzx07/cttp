import { CTTPError } from "./CTTPError";

export class ArchiveError extends CTTPError {
  constructor(message: string, details?: any) {
    super(400, message, "ARCHIVE_ERROR", details);
    this.name = "ArchiveError";
    Object.setPrototypeOf(this, ArchiveError.prototype);
  }
}