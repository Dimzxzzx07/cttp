import { ZeroBuffer } from "../../src/core/ZeroBuffer";

describe("ZeroBuffer", () => {
  let zeroBuffer: ZeroBuffer;

  beforeEach(() => {
    zeroBuffer = new ZeroBuffer({ enableZeroing: true });
  });

  test("should create instance", () => {
    expect(zeroBuffer).toBeDefined();
  });

  test("should zero buffer", () => {
    const buffer = Buffer.from("test data");
    zeroBuffer.zero(buffer);
    expect(buffer.toString()).toBe("\x00\x00\x00\x00\x00\x00\x00\x00\x00");
  });

  test("should zero string", () => {
    const result = zeroBuffer.zeroString("test");
    expect(result).toBe("test");
  });

  test("should zero object", () => {
    const obj = { field: "test" };
    zeroBuffer.zeroObject(obj);
    expect(obj.field).toBe("test");
  });

  test("should check if zeroed", () => {
    const buffer = Buffer.from("\x00\x00\x00");
    expect(zeroBuffer.isZeroed(buffer)).toBe(true);
  });

  test("should get zeroed count", () => {
    const buffer = Buffer.from("test");
    zeroBuffer.zero(buffer);
    expect(zeroBuffer.getZeroedCount()).toBeGreaterThan(0);
  });

  test("should clear", () => {
    const buffer = Buffer.from("test");
    zeroBuffer.zero(buffer);
    zeroBuffer.clear();
    expect(zeroBuffer.getZeroedCount()).toBe(0);
  });
});