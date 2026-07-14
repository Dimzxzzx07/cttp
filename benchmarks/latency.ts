import { CTTPClient } from "../src/core/CTTPClient";

async function latencyBenchmark() {
  const client = new CTTPClient({ logLevel: "error" });
  const iterations = 100;
  const latencies: number[] = [];

  try {
    for (let i = 0; i < iterations; i++) {
      const start = Date.now();
      await client.get("http://httpbin.org/get");
      latencies.push(Date.now() - start);
    }
    const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    const min = Math.min(...latencies);
    const max = Math.max(...latencies);
    console.log(`Average latency: ${avg.toFixed(2)}ms`);
    console.log(`Min latency: ${min}ms`);
    console.log(`Max latency: ${max}ms`);
  } finally {
    await client.close();
  }
}

latencyBenchmark();