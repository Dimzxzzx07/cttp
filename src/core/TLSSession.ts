import { ConfigTypes } from "../types/ConfigTypes";
import { Constants } from "./Constants";
import { CryptoUtils } from "../utils/CryptoUtils";

export class TLSSession {
  private config: ConfigTypes.TLSConfig;
  private constants: Constants;
  private cryptoUtils: CryptoUtils;
  private sessions: Map<string, any>;
  private certificates: Map<string, Buffer>;
  private privateKeys: Map<string, Buffer>;

  constructor(config: ConfigTypes.TLSConfig) {
    this.config = config;
    this.constants = new Constants();
    this.cryptoUtils = new CryptoUtils();
    this.sessions = new Map();
    this.certificates = new Map();
    this.privateKeys = new Map();
  }

  public async createSession(hostname: string, port: number): Promise<any> {
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

  public async getCertificate(hostname: string): Promise<Buffer> {
    if (this.certificates.has(hostname)) {
      return this.certificates.get(hostname)!;
    }
    
    const fs = require("fs");
    const certPath = this.config.certPath || `/etc/ssl/certs/${hostname}.pem`;
    const cert = fs.readFileSync(certPath);
    this.certificates.set(hostname, cert);
    return cert;
  }

  public async getPrivateKey(hostname: string): Promise<Buffer> {
    if (this.privateKeys.has(hostname)) {
      return this.privateKeys.get(hostname)!;
    }
    
    const fs = require("fs");
    const keyPath = this.config.keyPath || `/etc/ssl/private/${hostname}.key`;
    const key = fs.readFileSync(keyPath);
    this.privateKeys.set(hostname, key);
    return key;
  }

  public async verifyCertificate(cert: Buffer): Promise<boolean> {
    const crypto = require("crypto");
    const x509 = crypto.X509Certificate;
    try {
      const certObj = new x509(cert);
      const now = new Date();
      const notBefore = new Date(certObj.validFrom);
      const notAfter = new Date(certObj.validTo);
      return notBefore <= now && now <= notAfter;
    } catch {
      return false;
    }
  }

  public async generateKeyPair(): Promise<{ publicKey: Buffer, privateKey: Buffer }> {
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

  public async close(): Promise<void> {
    for (const [key, session] of this.sessions) {
      session.destroy();
    }
    this.sessions.clear();
  }
}