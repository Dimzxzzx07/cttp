import { CTTPError } from "./CTTPError";

export class MergeError extends CTTPError {
  constructor(message: string, details?: any) {
    super(400, message, "MERGE_ERROR", details);
    this.name = "MergeError";
    Object.setPrototypeOf(this, MergeError.prototype);
  }
}