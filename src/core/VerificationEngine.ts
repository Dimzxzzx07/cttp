import { CTTPClient } from "./CTTPClient";
import { CTTPRequest } from "./CTTPRequest";
import { CTTPResponse } from "./CTTPResponse";
import { HTTPMethod } from "./HTTPMethod";
import { ConfigTypes } from "../types/ConfigTypes";
import { VerifyTypes } from "../types/VerifyTypes";
import { BufferUtils } from "../utils/BufferUtils";
import { CryptoUtils } from "../utils/CryptoUtils";
import { Constants } from "./Constants";

export class VerificationEngine {
  private client: CTTPClient;
  private bufferUtils: BufferUtils;
  private cryptoUtils: CryptoUtils;
  private constants: Constants;
  private config: ConfigTypes.VerifyConfig;
  private verificationCache: Map<string, VerifyTypes.VerificationResult>;

  constructor(config: ConfigTypes.VerifyConfig) {
    this.config = config;
    this.constants = new Constants();
    this.bufferUtils = new BufferUtils();
    this.cryptoUtils = new CryptoUtils();
    this.client = new CTTPClient();
    this.verificationCache = new Map();
  }

  public async verify(
    url: string,
    options: VerifyTypes.VerifyOptions
  ): Promise<VerifyTypes.VerificationResult> {
    const verifyId = this.generateVerifyId();
    const type = options.type;
    const value = options.value;
    
    const request = new CTTPRequest(
      HTTPMethod.VERIFY,
      url,
      {
        body: {
          verifyId,
          type,
          value,
          options: options.options || {}
        }
      }
    );
    
    const response = await this.client.request(request);
    const data = response.getBody();
    
    const result: VerifyTypes.VerificationResult = {
      valid: data.valid || false,
      message: data.message || "",
      timestamp: data.timestamp || Date.now(),
      details: data.details || null
    };
    
    this.verificationCache.set(verifyId, result);
    
    return result;
  }

  private generateVerifyId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  public async verifyOTP(otp: string, url?: string): Promise<boolean> {
    const endpoint = url || "/verify/otp";
    const result = await this.verify(endpoint, { type: "otp", value: otp });
    return result.valid;
  }

  public async verifyEmail(email: string, url?: string): Promise<boolean> {
    const endpoint = url || "/verify/email";
    const result = await this.verify(endpoint, { type: "email", value: email });
    return result.valid;
  }

  public async verifyPhone(phone: string, url?: string): Promise<boolean> {
    const endpoint = url || "/verify/phone";
    const result = await this.verify(endpoint, { type: "phone", value: phone });
    return result.valid;
  }

  public async verifyJSON(json: any, schema?: any, url?: string): Promise<boolean> {
    const endpoint = url || "/verify/json";
    const result = await this.verify(endpoint, {
      type: "json",
      value: json,
      options: { schema }
    });
    return result.valid;
  }

  public async verifyJWT(token: string, url?: string): Promise<boolean> {
    const endpoint = url || "/verify/jwt";
    const result = await this.verify(endpoint, { type: "jwt", value: token });
    return result.valid;
  }

  public async verifySignature(
    data: any,
    signature: string,
    url?: string
  ): Promise<boolean> {
    const endpoint = url || "/verify/signature";
    const result = await this.verify(endpoint, {
      type: "signature",
      value: { data, signature }
    });
    return result.valid;
  }

  public async verifyChecksum(
    data: any,
    checksum: string,
    url?: string
  ): Promise<boolean> {
    const endpoint = url || "/verify/checksum";
    const result = await this.verify(endpoint, {
      type: "checksum",
      value: { data, checksum }
    });
    return result.valid;
  }

  public getVerificationResult(verifyId: string): VerifyTypes.VerificationResult | undefined {
    return this.verificationCache.get(verifyId);
  }

  public clearCache(verifyId?: string): void {
    if (verifyId) {
      this.verificationCache.delete(verifyId);
    } else {
      this.verificationCache.clear();
    }
  }

  public async close(): Promise<void> {
    await this.client.close();
    this.verificationCache.clear();
  }
}