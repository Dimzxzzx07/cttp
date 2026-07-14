import { ConfigTypes } from "../types/ConfigTypes";
import { VerifyTypes } from "../types/VerifyTypes";
export declare class VerificationEngine {
    private client;
    private bufferUtils;
    private cryptoUtils;
    private constants;
    private config;
    private verificationCache;
    constructor(config: ConfigTypes.VerifyConfig);
    verify(url: string, options: VerifyTypes.VerifyOptions): Promise<VerifyTypes.VerificationResult>;
    private generateVerifyId;
    verifyOTP(otp: string, url?: string): Promise<boolean>;
    verifyEmail(email: string, url?: string): Promise<boolean>;
    verifyPhone(phone: string, url?: string): Promise<boolean>;
    verifyJSON(json: any, schema?: any, url?: string): Promise<boolean>;
    verifyJWT(token: string, url?: string): Promise<boolean>;
    verifySignature(data: any, signature: string, url?: string): Promise<boolean>;
    verifyChecksum(data: any, checksum: string, url?: string): Promise<boolean>;
    getVerificationResult(verifyId: string): VerifyTypes.VerificationResult | undefined;
    clearCache(verifyId?: string): void;
    close(): Promise<void>;
}
//# sourceMappingURL=VerificationEngine.d.ts.map