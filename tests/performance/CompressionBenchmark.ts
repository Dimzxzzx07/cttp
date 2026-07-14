import { HeaderCompressor } from "../../src/core/HeaderCompressor";
import { BufferUtils } from "../../src/utils/BufferUtils";

describe("Compression Benchmark", () => {
  let compressor: HeaderCompressor;
  let bufferUtils: BufferUtils;
  const testData = new Map([
    ["host", "example.com"],
    ["user-agent", "Mozilla/5.0"],
    ["accept", "application/json"],
    ["content-type", "application/json"],
    ["authorization", "Bearer token123"],
    ["cookie", "session=abc123"]
  ]);

  beforeEach(() => {
    compressor = new HeaderCompressor();
    bufferUtils = new BufferUtils();
  });

  test("should compress headers quickly", () => {
    const start = Date.now();
    const compressed = compressor.compress(testData);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(10);
    expect(compressed.length).toBeLessThan(500);
  });

  test("should decompress headers quickly", () => {
    const compressed = compressor.compress(testData);
    const start = Date.now();
    const decompressed = compressor.decompress(compressed);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(10);
    expect(decompressed.size).toBe(testData.size);
  });

  test("should maintain data integrity", () => {
    const compressed = compressor.compress(testData);
    const decompressed = compressor.decompress(compressed);
    for (const [key, value] of testData) {
      expect(decompressed.get(key)).toBe(value);
    }
  });

  test("should handle large headers", () => {
    const largeData = new Map();
    for (let i = 0; i < 100; i++) {
      largeData.set(`header-${i}`, `value-${i}`);
    }
    const start = Date.now();
    const compressed = compressor.compress(largeData);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(50);
    expect(compressed.length).toBeLessThan(1000);
  });
});