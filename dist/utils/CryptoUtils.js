"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoUtils = void 0;
class CryptoUtils {
    constructor() {
        this.crypto = require("crypto");
    }
    sha256(data) {
        return this.crypto.createHash("sha256").update(data).digest();
    }
    sha512(data) {
        return this.crypto.createHash("sha512").update(data).digest();
    }
    md5(data) {
        return this.crypto.createHash("md5").update(data).digest();
    }
    hmacSha256(data, key) {
        return this.crypto.createHmac("sha256", key).update(data).digest();
    }
    hmacSha512(data, key) {
        return this.crypto.createHmac("sha512", key).update(data).digest();
    }
    generateIV() {
        return this.crypto.randomBytes(12);
    }
    generateKey(length = 32) {
        return this.crypto.randomBytes(length);
    }
    encryptAESGCM(data, key, iv) {
        const cipher = this.crypto.createCipheriv("aes-256-gcm", key, iv);
        const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
        const tag = cipher.getAuthTag();
        return Buffer.concat([encrypted, tag]);
    }
    decryptAESGCM(data, key, iv) {
        const tag = data.subarray(data.length - 16);
        const encrypted = data.subarray(0, data.length - 16);
        const decipher = this.crypto.createDecipheriv("aes-256-gcm", key, iv);
        decipher.setAuthTag(tag);
        return Buffer.concat([decipher.update(encrypted), decipher.final()]);
    }
    encryptAESCBC(data, key, iv) {
        const cipher = this.crypto.createCipheriv("aes-256-cbc", key, iv);
        return Buffer.concat([cipher.update(data), cipher.final()]);
    }
    decryptAESCBC(data, key, iv) {
        const decipher = this.crypto.createDecipheriv("aes-256-cbc", key, iv);
        return Buffer.concat([decipher.update(data), decipher.final()]);
    }
    rsaEncrypt(data, publicKey) {
        return this.crypto.publicEncrypt(publicKey, data);
    }
    rsaDecrypt(data, privateKey) {
        return this.crypto.privateDecrypt(privateKey, data);
    }
    randomBytes(size) {
        return this.crypto.randomBytes(size);
    }
    randomInt(max) {
        return this.crypto.randomInt(max);
    }
    uuid() {
        return this.crypto.randomUUID();
    }
    pbkdf2(password, salt, iterations, length) {
        return this.crypto.pbkdf2Sync(password, salt, iterations, length, "sha256");
    }
    scrypt(password, salt, length) {
        return this.crypto.scryptSync(password, salt, length);
    }
    verifySignature(data, signature, publicKey) {
        const verify = this.crypto.createVerify("sha256");
        verify.update(data);
        return verify.verify(publicKey, signature);
    }
    sign(data, privateKey) {
        const sign = this.crypto.createSign("sha256");
        sign.update(data);
        return sign.sign(privateKey);
    }
}
exports.CryptoUtils = CryptoUtils;
//# sourceMappingURL=CryptoUtils.js.map