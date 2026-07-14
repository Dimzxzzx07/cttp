import CTTPClient from "../src/core/CTTPClient";
import { WorkerThreadManager } from "../src/core/WorkerThreadManager";

async function workerThreadsExample() {
  const client = new CTTPClient({
    logLevel: "info"
  });

  const workerManager = new WorkerThreadManager({
    taskTimeout: 30000,
    bufferConfig: { maxPoolSize: 50 }
  });

  try {
    console.log("=== Worker Threads Example ===");

    await workerManager.createWorker("converter", `
      const { parentPort } = require('worker_threads');
      parentPort.on('message', (task) => {
        const result = { processed: true, data: task.data };
        parentPort.postMessage(result);
      });
    `);

    const results = await workerManager.executeInParallel(
      [{ data: "task1" }, { data: "task2" }, { data: "task3" }],
      ["converter", "converter", "converter"]
    );
    console.log("Parallel results:", results.length);

    await workerManager.shutdown();
    await client.close();
  } catch (error) {
    console.error("Error:", error);
  }
}

workerThreadsExample();