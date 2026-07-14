export interface IVerify {
    verify(url: string, options: any): Promise<any>;
    verifyOTP(otp: string, url?: string): Promise<boolean>;
    verifyEmail(email: string, url?: string): Promise<boolean>;
    verifyPhone(phone: string, url?: string): Promise<boolean>;
    verifyJSON(json: any, schema?: any, url?: string): Promise<boolean>;
    verifyJWT(token: string, url?: string): Promise<boolean>;
}
//# sourceMappingURL=IVerify.d.ts.map