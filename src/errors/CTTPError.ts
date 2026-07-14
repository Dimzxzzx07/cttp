export class CTTPError extends Error {
  private status: number;
  private code: string;
  private details: any;

  constructor(status: number, message: string, code?: string, details?: any) {
    super(message);
    this.name = "CTTPError";
    this.status = status;
    this.code = code || "UNKNOWN_ERROR";
    this.details = details || null;
    Object.setPrototypeOf(this, CTTPError.prototype);
  }

  public getStatus(): number {
    return this.status;
  }

  public getCode(): string {
    return this.code;
  }

  public getDetails(): any {
    return this.details;
  }

  public toJSON(): any {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      details: this.details
    };
  }
}