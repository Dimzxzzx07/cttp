export declare namespace VerifyTypes {
    interface VerifyOptions {
        type: "otp" | "email" | "phone" | "json" | "jwt" | "signature" | "checksum" | "captcha";
        value: any;
        options?: any;
    }
    interface VerificationResult {
        valid: boolean;
        message: string;
        timestamp: number;
        details?: any;
    }
}
//# sourceMappingURL=VerifyTypes.d.ts.map