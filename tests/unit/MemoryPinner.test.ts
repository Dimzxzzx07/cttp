import { MemoryPinner } from "../../src/core/MemoryPinner";

describe("MemoryPinner", () => {
  let pinner: MemoryPinner;

  beforeEach(() => {
    pinner = new MemoryPinner({ memoryLimit: 1024 * 100 });
  });

  test("should create instance", () => {
    expect(pinner).toBeDefined();
  });

  test("should pin buffer", () => {
    const buffer = Buffer.from("test data");
    pinner.pinBuffer("test-id", buffer);
    expect(pinner.getPinnedCount()).toBe(1);
  });

  test("should get pinned buffer", () => {
    const buffer = Buffer.from("test data");
    pinner.pinBuffer("test-id", buffer);
    const retrieved = pinner.getPinnedBuffer("test-id");
    expect(retrieved).toBeDefined();
    expect(retrieved?.toString()).toBe("test data");
  });

  test("should unpin buffer", () => {
    const buffer = Buffer.from("test data");
    pinner.pinBuffer("test-id", buffer);
    pinner.unpinBuffer("test-id");
    expect(pinner.getPinnedCount()).toBe(0);
  });

  test("should get memory usage", () => {
    const buffer = Buffer.from("test data");
    pinner.pinBuffer("test-id", buffer);
    expect(pinner.getMemoryUsage()).toBeGreaterThan(0);
  });

  test("should clear all buffers", () => {
    const buffer = Buffer.from("test data");
    pinner.pinBuffer("test-id", buffer);
    pinner.clear();
    expect(pinner.getPinnedCount()).toBe(0);
  });
});