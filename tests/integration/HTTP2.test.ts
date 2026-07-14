import { CTTPClient } from "../../src/core/CTTPClient";
import { HTTPVersion } from "../../src/core/HTTPVersion";

describe("HTTP/2 Integration", () => {
  let client: CTTPClient;

  beforeEach(() => {
    client = new CTTPClient({
      defaultVersion: HTTPVersion.HTTP_2,
      logLevel: "error"
    });
  });

  afterEach(async () => {
    await client.close();
  });

  test("should connect to HTTP/2 server", async () => {
    const response = await client.get("https://nghttp2.org/httpbin/get");
    expect(response.getStatus()).toBe(200);
  });

  test("should send POST with body", async () => {
    const response = await client.post("https://nghttp2.org/httpbin/post", {
      body: { test: "data" }
    });
    expect(response.getStatus()).toBe(200);
  });

  test("should handle multiple requests", async () => {
    const responses = await Promise.all([
      client.get("https://nghttp2.org/httpbin/get"),
      client.get("https://nghttp2.org/httpbin/get"),
      client.get("https://nghttp2.org/httpbin/get")
    ]);
    for (const response of responses) {
      expect(response.getStatus()).toBe(200);
    }
  });

  test("should handle headers", async () => {
    const response = await client.get("https://nghttp2.org/httpbin/headers", {
      headers: { "X-Test": "value" }
    });
    expect(response.getStatus()).toBe(200);
  });

  test("should handle custom method via tunnel", async () => {
    const response = await client.ping("https://nghttp2.org/httpbin/get");
    expect(response.getStatus()).toBe(200);
  });
});