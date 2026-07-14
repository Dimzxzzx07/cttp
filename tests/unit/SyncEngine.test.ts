import { SyncEngine } from "../../src/core/SyncEngine";

describe("SyncEngine", () => {
  let engine: SyncEngine;

  beforeEach(() => {
    engine = new SyncEngine({ defaultStrategy: "merge" });
  });

  afterEach(async () => {
    await engine.close();
  });

  test("should create instance", () => {
    expect(engine).toBeDefined();
  });

  test("should generate sync id", () => {
    const syncId = "test-sync";
    const state = engine.getSyncState(syncId);
    expect(state).toBeUndefined();
  });

  test("should get sync states", () => {
    const states = engine.getSyncStates();
    expect(Array.isArray(states)).toBe(true);
  });

  test("should clear sync state", () => {
    const syncId = "test-sync";
    engine.clearSyncState(syncId);
    expect(engine.getSyncState(syncId)).toBeUndefined();
  });

  test("should clear all sync states", () => {
    engine.clearAllSyncStates();
    expect(engine.getSyncStates().length).toBe(0);
  });
});