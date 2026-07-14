import { CTTPError } from "./CTTPError";

export class UndoError extends CTTPError {
  constructor(message: string, details?: any) {
    super(400, message, "UNDO_ERROR", details);
    this.name = "UndoError";
    Object.setPrototypeOf(this, UndoError.prototype);
  }
}