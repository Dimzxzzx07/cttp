import { MergeEngine } from "../../src/core/MergeEngine";

describe("MergeEngine", () => {
  let engine: MergeEngine;

  beforeEach(() => {
    engine = new MergeEngine({ defaultStrategy: "union" });
  });

  afterEach(async () => {
    await engine.close();
  });

  test("should create instance", () => {
    expect(engine).toBeDefined();
  });

  test("should get merge sessions", () => {
    const sessions = engine.getMergeSessions();
    expect(Array.isArray(sessions)).toBe(true);
  });

  test("should get resolution", () => {
    const resolution = engine.getResolution("test-conflict");
    expect(resolution).toBeUndefined();
  });

  test("should clear merge session", () => {
    engine.clearMergeSession("test-merge");
    expect(engine.getMergeSession("test-merge")).toBeUndefined();
  });

  test("should clear all sessions", () => {
    engine.clearAllSessions();
    expect(engine.getMergeSessions().length).toBe(0);
  });
});