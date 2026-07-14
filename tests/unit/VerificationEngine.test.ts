import { VerificationEngine } from "../../src/core/VerificationEngine";

describe("VerificationEngine", () => {
  let engine: VerificationEngine;

  beforeEach(() => {
    engine = new VerificationEngine({ cacheSize: 100 });
  });

  afterEach(async () => {
    await engine.close();
  });

  test("should create instance", () => {
    expect(engine).toBeDefined();
  });

  test("should verify email format", async () => {
    const result = await engine.verifyEmail("test@example.com");
    expect(result).toBe(true);
  });

  test("should verify invalid email", async () => {
    const result = await engine.verifyEmail("invalid-email");
    expect(result).toBe(false);
  });

  test("should verify phone format", async () => {
    const result = await engine.verifyPhone("+6281234567890");
    expect(result).toBe(true);
  });

  test("should verify OTP", async () => {
    const result = await engine.verifyOTP("123456");
    expect(result).toBe(true);
  });

  test("should get verification result", () => {
    const result = engine.getVerificationResult("test-verify");
    expect(result).toBeUndefined();
  });

  test("should clear cache", () => {
    engine.clearCache("test-verify");
    expect(engine.getVerificationResult("test-verify")).toBeUndefined();
  });
});