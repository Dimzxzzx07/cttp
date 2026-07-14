import { CryptoUtils } from "../../src/utils/CryptoUtils";
import { BufferUtils } from "../../src/utils/BufferUtils";

describe("Encryption Benchmark", () => {
  let cryptoUtils: CryptoUtils;
  let bufferUtils: BufferUtils;
  const dataSize = 1024 * 1024;

  beforeEach(() => {
    cryptoUtils = new CryptoUtils();
    bufferUtils = new BufferUtils();
  });

  test("should encrypt AES-256-GCM quickly", () => {
    const data = Buffer.alloc(dataSize);
    const key = cryptoUtils.generateKey(32);
    const iv = cryptoUtils.generateIV();
    const start = Date.now();
    cryptoUtils.encryptAESGCM(data, key, iv);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(50);
  });

  test("should decrypt AES-256-GCM quickly", () => {
    const data = Buffer.alloc(dataSize);
    const key = cryptoUtils.generateKey(32);
    const iv = cryptoUtils.generateIV();
    const encrypted = cryptoUtils.encryptAESGCM(data, key, iv);
    const start = Date.now();
    cryptoUtils.decryptAESGCM(encrypted, key, iv);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(50);
  });

  test("should generate SHA-256 quickly", () => {
    const data = Buffer.alloc(dataSize);
    const start = Date.now();
    cryptoUtils.sha256(data);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(20);
  });

  test("should generate SHA-512 quickly", () => {
    const data = Buffer.alloc(dataSize);
    const start = Date.now();
    cryptoUtils.sha512(data);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(30);
  });

  test("should generate random bytes quickly", () => {
    const start = Date.now();
    cryptoUtils.randomBytes(dataSize);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(10);
  });
});