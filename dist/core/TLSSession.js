"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TLSSession = void 0;
const Constants_1 = require("./Constants");
const CryptoUtils_1 = require("../utils/CryptoUtils");
class TLSSession {
    constructor(config) {
        this.config = config;
        this.constants = new Constants_1.Constants();
        this.cryptoUtils = new CryptoUtils_1.CryptoUtils();
        this.sessions = new Map();
        this.certificates = new Map();
        this.privateKeys = new Map();
    }
    async createSession(hostname, port) {
        const tls = require("tls");
        const key = `${hostname}:${port}`;
        if (this.sessions.has(key)) {
            return this.sessions.get(key);
        }
        const session = tls.connect({
            host: hostname,
            port: port,
            rejectUnauthorized: this.config.rejectUnauthorized !== false,
            minVersion: this.config.minVersion || "TLSv1.2",
            maxVersion: this.config.maxVersion || "TLSv1.3",
            secureProtocol: this.config.secureProtocol
        });
        this.sessions.set(key, session);
        return session;
    }
    async getCertificate(hostname) {
        if (this.certificates.has(hostname)) {
            return this.certificates.get(hostname);
        }
        const fs = require("fs");
        const certPath = this.config.certPath || `/etc/ssl/certs/${hostname}.pem`;
        const cert = fs.readFileSync(certPath);
        this.certificates.set(hostname, cert);
        return cert;
    }
    async getPrivateKey(hostname) {
        if (this.privateKeys.has(hostname)) {
            return this.privateKeys.get(hostname);
        }
        const fs = require("fs");
        const keyPath = this.config.keyPath || `/etc/ssl/private/${hostname}.key`;
        const key = fs.readFileSync(keyPath);
        this.privateKeys.set(hostname, key);
        return key;
    }
    async verifyCertificate(cert) {
        const crypto = require("crypto");
        const x509 = crypto.X509Certificate;
        try {
            const certObj = new x509(cert);
            const now = new Date();
            const notBefore = new Date(certObj.validFrom);
            const notAfter = new Date(certObj.validTo);
            return notBefore <= now && now <= notAfter;
        }
        catch {
            return false;
        }
    }
    async generateKeyPair() {
        const crypto = require("crypto");
        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: { type: "spki", format: "pem" },
            privateKeyEncoding: { type: "pkcs8", format: "pem" }
        });
        return {
            publicKey: Buffer.from(publicKey),
            privateKey: Buffer.from(privateKey)
        };
    }
    async close() {
        for (const [key, session] of this.sessions) {
            session.destroy();
        }
        this.sessions.clear();
    }
}
exports.TLSSession = TLSSession;
//# sourceMappingURL=TLSSession.js.map