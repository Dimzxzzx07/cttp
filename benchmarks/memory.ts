import { CTTPClient } from "../src/core/CTTPClient";

async function memoryBenchmark() {
  const client = new CTTPClient({ logLevel: "error" });
  const iterations = 1000;

  try {
    const initialMemory = process.memoryUsage().heapUsed;
    const start = Date.now();

    for (let i = 0; i < iterations; i++) {
      await client.get("http://httpbin.org/get");
      if (i % 100 === 0) {
        const currentMemory = process.memoryUsage().heapUsed;
        console.log(`Iteration ${i}: ${(currentMemory / 1024 / 1024).toFixed(2)}MB`);
      }
    }

    const finalMemory = process.memoryUsage().heapUsed;
    const totalDuration = Date.now() - start;
    const memoryDelta = (finalMemory - initialMemory) / 1024 / 1024;

    console.log(`Total duration: ${totalDuration}ms`);
    console.log(`Memory delta: ${memoryDelta.toFixed(2)}MB`);
  } finally {
    await client.close();
  }
}

memoryBenchmark();