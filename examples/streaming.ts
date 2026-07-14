import CTTPClient from "../src/core/CTTPClient";

async function streamingExample() {
  const client = new CTTPClient({
    logLevel: "info"
  });

  try {
    console.log("=== Streaming Example ===");

    const stream = await client.stream("https://api.example.com/stream", {
      event: "data",
      encoding: "json"
    });

    console.log("Stream started:", stream.getStatus());

    await client.close();
  } catch (error) {
    console.error("Stream error:", error);
  }
}

streamingExample();