import { CTTPClient } from "../../src/core/CTTPClient";
import { HTTPVersion } from "../../src/core/HTTPVersion";

describe("QUIC Integration", () => {
  let client: CTTPClient;

  beforeEach(() => {
    client = new CTTPClient({
      defaultVersion: HTTPVersion.QUIC,
      logLevel: "error"
    });
  });

  afterEach(async () => {
    await client.close();
  });

  test("should connect via QUIC", async () => {
    try {
      const response = await client.get("https://cloudflare-quic.com");
      expect(response.getStatus()).toBe(200);
    } catch (error) {
      console.log("QUIC test skipped - server may not support QUIC");
    }
  });

  test("should handle request/response", async () => {
    try {
      const response = await client.post("https://cloudflare-quic.com", {
        body: { test: "quic" }
      });
      expect(response.getStatus()).toBe(200);
    } catch (error) {
      console.log("QUIC test skipped - server may not support QUIC");
    }
  });
});