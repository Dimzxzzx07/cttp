export namespace VerifyTypes {
  export interface VerifyOptions {
    type: "otp" | "email" | "phone" | "json" | "jwt" | "signature" | "checksum" | "captcha";
    value: any;
    options?: any;
  }

  export interface VerificationResult {
    valid: boolean;
    message: string;
    timestamp: number;
    details?: any;
  }
}