import { CTTPError } from "./CTTPError";

export class StreamError extends CTTPError {
  constructor(message: string, details?: any) {
    super(400, message, "STREAM_ERROR", details);
    this.name = "StreamError";
    Object.setPrototypeOf(this, StreamError.prototype);
  }
}