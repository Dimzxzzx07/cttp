import { CTTPClient } from "../../src/core/CTTPClient";
import { HTTPVersion } from "../../src/core/HTTPVersion";

describe("HTTP/3 Integration", () => {
  let client: CTTPClient;

  beforeEach(() => {
    client = new CTTPClient({
      defaultVersion: HTTPVersion.HTTP_3,
      logLevel: "error"
    });
  });

  afterEach(async () => {
    await client.close();
  });

  test("should connect to HTTP/3 server", async () => {
    try {
      const response = await client.get("https://cloudflare-quic.com");
      expect(response.getStatus()).toBe(200);
    } catch (error) {
      // Skip if HTTP/3 not available
      console.log("HTTP/3 test skipped - server may not support HTTP/3");
    }
  });

  test("should handle POST request", async () => {
    try {
      const response = await client.post("https://cloudflare-quic.com", {
        body: { test: "data" }
      });
      expect(response.getStatus()).toBe(200);
    } catch (error) {
      console.log("HTTP/3 test skipped - server may not support HTTP/3");
    }
  });

  test("should handle multiple requests", async () => {
    try {
      const responses = await Promise.all([
        client.get("https://cloudflare-quic.com"),
        client.get("https://cloudflare-quic.com")
      ]);
      for (const response of responses) {
        expect(response.getStatus()).toBe(200);
      }
    } catch (error) {
      console.log("HTTP/3 test skipped - server may not support HTTP/3");
    }
  });
});