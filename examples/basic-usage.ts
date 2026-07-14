import CTTPClient from "../src/core/CTTPClient";

async function basicUsage() {
  const client = new CTTPClient({
    defaultTimeout: 30000,
    logLevel: "info"
  });

  try {
    console.log("=== Basic Usage Example ===");

    const response = await client.get("https://jsonplaceholder.typicode.com/posts/1");
    console.log("GET Response:", response.getStatus());
    console.log("Body:", response.getBody());

    const postResponse = await client.post("https://jsonplaceholder.typicode.com/posts", {
      body: {
        title: "Test Post",
        body: "This is a test post",
        userId: 1
      }
    });
    console.log("POST Response:", postResponse.getStatus());

    await client.close();
    console.log("Client closed successfully");
  } catch (error) {
    console.error("Error:", error);
  }
}

basicUsage();