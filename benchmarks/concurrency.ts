import { CTTPClient } from "../src/core/CTTPClient";

async function concurrencyBenchmark() {
  const client = new CTTPClient({
    poolConfig: { maxConnections: 50 },
    logLevel: "error"
  });
  const concurrencyLevels = [10, 25, 50, 100];

  try {
    for (const concurrency of concurrencyLevels) {
      const start = Date.now();
      const promises = [];
      for (let i = 0; i < concurrency; i++) {
        promises.push(client.get("http://httpbin.org/get"));
      }
      await Promise.all(promises);
      const duration = Date.now() - start;
      console.log(`Concurrency ${concurrency}: ${duration}ms`);
    }
  } finally {
    await client.close();
  }
}

concurrencyBenchmark();