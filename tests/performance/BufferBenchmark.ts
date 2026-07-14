import { BufferUtils } from "../../src/utils/BufferUtils";

describe("BufferBenchmark", () => {
  let bufferUtils: BufferUtils;
  const dataSize = 1024 * 1024;

  beforeEach(() => {
    bufferUtils = new BufferUtils();
  });

  test("should concat buffers quickly", () => {
    const buffers = [];
    for (let i = 0; i < 100; i++) {
      buffers.push(Buffer.alloc(dataSize / 100));
    }
    const start = Date.now();
    bufferUtils.concat(buffers);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100);
  });

  test("should copy buffers quickly", () => {
    const source = Buffer.alloc(dataSize);
    const target = Buffer.alloc(dataSize);
    const start = Date.now();
    bufferUtils.copy(source, target);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(50);
  });

  test("should convert to hex quickly", () => {
    const buffer = Buffer.alloc(dataSize);
    const start = Date.now();
    bufferUtils.toHex(buffer);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100);
  });
});