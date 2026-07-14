import { CTTPClient } from "../src/core/CTTPClient";

async function throughputBenchmark() {
  const client = new CTTPClient({ logLevel: "error" });
  const iterations = 1000;
  const start = Date.now();

  try {
    for (let i = 0; i < iterations; i++) {
      await client.get("http://httpbin.org/get");
    }
    const duration = Date.now() - start;
    const throughput = iterations / (duration / 1000);
    console.log(`Throughput: ${throughput.toFixed(2)} req/s`);
    console.log(`Total: ${duration}ms for ${iterations} requests`);
  } finally {
    await client.close();
  }
}

throughputBenchmark();