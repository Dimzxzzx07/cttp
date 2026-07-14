import { UndoManager } from "../../src/core/UndoManager";

describe("UndoManager", () => {
  let manager: UndoManager;

  beforeEach(() => {
    manager = new UndoManager({ maxHistory: 100, maxStack: 50 });
  });

  afterEach(async () => {
    await manager.close();
  });

  test("should create instance", () => {
    expect(manager).toBeDefined();
  });

  test("should clear history", () => {
    manager.clearHistory("test-resource");
    const history = manager["undoHistory"].get("test-resource");
    expect(history).toBeUndefined();
  });

  test("should clear stack", () => {
    manager.clearStack("test-resource");
    const stack = manager["undoStack"].get("test-resource");
    expect(stack).toBeUndefined();
  });

  test("should clear all", () => {
    manager.clearAll();
    expect(manager["undoHistory"].size).toBe(0);
    expect(manager["undoStack"].size).toBe(0);
  });
});