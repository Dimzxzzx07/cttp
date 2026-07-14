/// <reference types="node" />
/// <reference types="node" />
export declare class CryptoUtils {
    private crypto;
    constructor();
    sha256(data: Buffer): Buffer;
    sha512(data: Buffer): Buffer;
    md5(data: Buffer): Buffer;
    hmacSha256(data: Buffer, key: Buffer): Buffer;
    hmacSha512(data: Buffer, key: Buffer): Buffer;
    generateIV(): Buffer;
    generateKey(length?: number): Buffer;
    encryptAESGCM(data: Buffer, key: Buffer, iv: Buffer): Buffer;
    decryptAESGCM(data: Buffer, key: Buffer, iv: Buffer): Buffer;
    encryptAESCBC(data: Buffer, key: Buffer, iv: Buffer): Buffer;
    decryptAESCBC(data: Buffer, key: Buffer, iv: Buffer): Buffer;
    rsaEncrypt(data: Buffer, publicKey: Buffer): Buffer;
    rsaDecrypt(data: Buffer, privateKey: Buffer): Buffer;
    randomBytes(size: number): Buffer;
    randomInt(max: number): number;
    uuid(): string;
    pbkdf2(password: Buffer, salt: Buffer, iterations: number, length: number): Buffer;
    scrypt(password: Buffer, salt: Buffer, length: number): Buffer;
    verifySignature(data: Buffer, signature: Buffer, publicKey: Buffer): boolean;
    sign(data: Buffer, privateKey: Buffer): Buffer;
}
//# sourceMappingURL=CryptoUtils.d.ts.map