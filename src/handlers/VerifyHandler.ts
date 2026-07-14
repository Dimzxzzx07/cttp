import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
import { CTTPResponse } from "../core/CTTPResponse";
import { HTTPVersion } from "../core/HTTPVersion";

export class VerifyHandler implements IMethodHandler {
  public async handle(request: IHTTPRequest): Promise<IHTTPResponse> {
    const body = request.getBody();
    const type = body?.type;
    const value = body?.value;
    const options = body?.options || {};
    
    if (!type || value === undefined) {
      return new CTTPResponse(
        400,
        "Bad Request",
        HTTPVersion.HTTP_1_1,
        new Map([["Content-Type", "application/json"]]),
        { error: "Missing type or value" }
      );
    }
    
    const valid = this.verifyValue(type, value, options);
    
    return new CTTPResponse(
      200,
      "OK",
      HTTPVersion.HTTP_1_1,
      new Map([["Content-Type", "application/json"]]),
      {
        valid,
        message: valid ? "Verification successful" : "Verification failed",
        timestamp: Date.now(),
        details: this.getDetails(type, value)
      }
    );
  }

  private verifyValue(type: string, value: any, options: any): boolean {
    switch (type) {
      case "otp":
        return this.verifyOTP(value, options);
      case "email":
        return this.verifyEmail(value);
      case "phone":
        return this.verifyPhone(value);
      case "json":
        return this.verifyJSON(value, options.schema);
      case "jwt":
        return this.verifyJWT(value);
      case "signature":
        return this.verifySignature(value.data, value.signature);
      case "checksum":
        return this.verifyChecksum(value.data, value.checksum);
      default:
        return false;
    }
  }

  private verifyOTP(otp: string, options: any): boolean {
    const expected = options?.expected || "123456";
    return otp === expected;
  }

  private verifyEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  private verifyPhone(phone: string): boolean {
    const regex = /^\+?[1-9]\d{1,14}$/;
    return regex.test(phone);
  }

  private verifyJSON(json: any, schema: any): boolean {
    if (!schema) {
      return typeof json === "object" && json !== null;
    }
    try {
      return this.validateJSONSchema(json, schema);
    } catch {
      return false;
    }
  }

  private verifyJWT(token: string): boolean {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return false;
      const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
      const exp = payload.exp || 0;
      return exp > Math.floor(Date.now() / 1000);
    } catch {
      return false;
    }
  }

  private verifySignature(data: any, signature: string): boolean {
    const crypto = require("crypto");
    const calculated = crypto
      .createHash("sha256")
      .update(JSON.stringify(data))
      .digest("hex");
    return calculated === signature;
  }

  private verifyChecksum(data: any, checksum: string): boolean {
    const crypto = require("crypto");
    const calculated = crypto
      .createHash("md5")
      .update(JSON.stringify(data))
      .digest("hex");
    return calculated === checksum;
  }

  private validateJSONSchema(json: any, schema: any): boolean {
    const keys = Object.keys(schema);
    for (const key of keys) {
      if (!json.hasOwnProperty(key)) {
        return false;
      }
      if (schema[key] === "string" && typeof json[key] !== "string") {
        return false;
      }
      if (schema[key] === "number" && typeof json[key] !== "number") {
        return false;
      }
      if (schema[key] === "boolean" && typeof json[key] !== "boolean") {
        return false;
      }
      if (schema[key] === "object" && typeof json[key] !== "object") {
        return false;
      }
      if (schema[key] === "array" && !Array.isArray(json[key])) {
        return false;
      }
    }
    return true;
  }

  private getDetails(type: string, value: any): any {
    return {
      type,
      value: typeof value === "string" ? value.substring(0, 20) : value,
      timestamp: Date.now()
    };
  }
}