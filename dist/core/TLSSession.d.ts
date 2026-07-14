/// <reference types="node" />
/// <reference types="node" />
import { ConfigTypes } from "../types/ConfigTypes";
export declare class TLSSession {
    private config;
    private constants;
    private cryptoUtils;
    private sessions;
    private certificates;
    private privateKeys;
    constructor(config: ConfigTypes.TLSConfig);
    createSession(hostname: string, port: number): Promise<any>;
    getCertificate(hostname: string): Promise<Buffer>;
    getPrivateKey(hostname: string): Promise<Buffer>;
    verifyCertificate(cert: Buffer): Promise<boolean>;
    generateKeyPair(): Promise<{
        publicKey: Buffer;
        privateKey: Buffer;
    }>;
    close(): Promise<void>;
}
//# sourceMappingURL=TLSSession.d.ts.map