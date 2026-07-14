import { ObjectPool } from "../../src/utils/ObjectPool";
import { ConnectionPool } from "../../src/core/ConnectionPool";

describe("Pool Benchmark", () => {
  test("ObjectPool should handle many allocations", () => {
    const pool = new ObjectPool(
      () => ({ id: Math.random(), data: Buffer.alloc(1024) }),
      (obj) => { obj.id = 0; },
      1000
    );

    const start = Date.now();
    const objects = [];
    for (let i = 0; i < 10000; i++) {
      const obj = pool.acquire();
      objects.push(obj);
      if (i % 10 === 0) {
        pool.release(objects.pop()!);
      }
    }
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100);
  });

  test("ConnectionPool should handle concurrent connections", async () => {
    const pool = new ConnectionPool({
      maxConnections: 100,
      idleTimeout: 60000,
      connectionTimeout: 30000
    });

    const start = Date.now();
    const promises = [];
    for (let i = 0; i < 50; i++) {
      promises.push(
        pool.acquire("http://localhost:8080")
          .then(() => pool.release({} as any))
          .catch(() => {})
      );
    }
    await Promise.all(promises);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100);
  });
});