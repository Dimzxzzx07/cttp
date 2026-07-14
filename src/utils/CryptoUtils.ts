export class CryptoUtils {
  private crypto: any;

  constructor() {
    this.crypto = require("crypto");
  }

  public sha256(data: Buffer): Buffer {
    return this.crypto.createHash("sha256").update(data).digest();
  }

  public sha512(data: Buffer): Buffer {
    return this.crypto.createHash("sha512").update(data).digest();
  }

  public md5(data: Buffer): Buffer {
    return this.crypto.createHash("md5").update(data).digest();
  }

  public hmacSha256(data: Buffer, key: Buffer): Buffer {
    return this.crypto.createHmac("sha256", key).update(data).digest();
  }

  public hmacSha512(data: Buffer, key: Buffer): Buffer {
    return this.crypto.createHmac("sha512", key).update(data).digest();
  }

  public generateIV(): Buffer {
    return this.crypto.randomBytes(12);
  }

  public generateKey(length: number = 32): Buffer {
    return this.crypto.randomBytes(length);
  }

  public encryptAESGCM(data: Buffer, key: Buffer, iv: Buffer): Buffer {
    const cipher = this.crypto.createCipheriv("aes-256-gcm", key, iv);
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([encrypted, tag]);
  }

  public decryptAESGCM(data: Buffer, key: Buffer, iv: Buffer): Buffer {
    const tag = data.subarray(data.length - 16);
    const encrypted = data.subarray(0, data.length - 16);
    const decipher = this.crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
  }

  public encryptAESCBC(data: Buffer, key: Buffer, iv: Buffer): Buffer {
    const cipher = this.crypto.createCipheriv("aes-256-cbc", key, iv);
    return Buffer.concat([cipher.update(data), cipher.final()]);
  }

  public decryptAESCBC(data: Buffer, key: Buffer, iv: Buffer): Buffer {
    const decipher = this.crypto.createDecipheriv("aes-256-cbc", key, iv);
    return Buffer.concat([decipher.update(data), decipher.final()]);
  }

  public rsaEncrypt(data: Buffer, publicKey: Buffer): Buffer {
    return this.crypto.publicEncrypt(publicKey, data);
  }

  public rsaDecrypt(data: Buffer, privateKey: Buffer): Buffer {
    return this.crypto.privateDecrypt(privateKey, data);
  }

  public randomBytes(size: number): Buffer {
    return this.crypto.randomBytes(size);
  }

  public randomInt(max: number): number {
    return this.crypto.randomInt(max);
  }

  public uuid(): string {
    return this.crypto.randomUUID();
  }

  public pbkdf2(password: Buffer, salt: Buffer, iterations: number, length: number): Buffer {
    return this.crypto.pbkdf2Sync(password, salt, iterations, length, "sha256");
  }

  public scrypt(password: Buffer, salt: Buffer, length: number): Buffer {
    return this.crypto.scryptSync(password, salt, length);
  }

  public verifySignature(data: Buffer, signature: Buffer, publicKey: Buffer): boolean {
    const verify = this.crypto.createVerify("sha256");
    verify.update(data);
    return verify.verify(publicKey, signature);
  }

  public sign(data: Buffer, privateKey: Buffer): Buffer {
    const sign = this.crypto.createSign("sha256");
    sign.update(data);
    return sign.sign(privateKey);
  }
}