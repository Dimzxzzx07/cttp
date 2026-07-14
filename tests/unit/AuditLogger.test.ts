import { AuditLogger } from "../../src/core/AuditLogger";

describe("AuditLogger", () => {
  let logger: AuditLogger;

  beforeEach(() => {
    logger = new AuditLogger({ maxEntries: 100 });
  });

  afterEach(async () => {
    await logger.close();
  });

  test("should create instance", () => {
    expect(logger).toBeDefined();
  });

  test("should get audit entries", () => {
    const entries = logger.getAuditEntries("test-audit");
    expect(entries).toBeUndefined();
  });

  test("should clear cache", () => {
    logger.clearCache("test-audit");
    expect(logger.getAuditEntries("test-audit")).toBeUndefined();
  });

  test("should get filter", () => {
    const filter = logger.getFilter("test-filter");
    expect(filter).toBeUndefined();
  });

  test("should clear filters", () => {
    logger.clearFilters();
    expect(logger.getFilter("test-filter")).toBeUndefined();
  });
});