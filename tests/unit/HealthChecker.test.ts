import { HealthChecker } from "../../src/core/HealthChecker";

describe("HealthChecker", () => {
  let checker: HealthChecker;

  beforeEach(() => {
    checker = new HealthChecker({ pingTimeout: 5000 });
  });

  afterEach(async () => {
    await checker.close();
  });

  test("should create instance", () => {
    expect(checker).toBeDefined();
  });

  test("should register check", () => {
    checker.registerCheck("test", async () => ({ status: true }));
    const status = checker.getHealthStatus("test");
    expect(status).toBeDefined();
  });

  test("should unregister check", () => {
    checker.registerCheck("test", async () => ({ status: true }));
    checker.unregisterCheck("test");
    const status = checker.getHealthStatus("test");
    expect(status).toBeUndefined();
  });

  test("should get all health status", () => {
    const all = checker.getAllHealthStatus();
    expect(all instanceof Map).toBe(true);
  });

  test("should clear health status", () => {
    checker.clearHealthStatus();
    const all = checker.getAllHealthStatus();
    expect(all.size).toBe(0);
  });
});