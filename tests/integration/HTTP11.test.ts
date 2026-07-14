import { CTTPClient } from "../../src/core/CTTPClient";
import { HTTPVersion } from "../../src/core/HTTPVersion";

describe("HTTP/1.1 Integration", () => {
  let client: CTTPClient;

  beforeEach(() => {
    client = new CTTPClient({
      defaultVersion: HTTPVersion.HTTP_1_1,
      logLevel: "error"
    });
  });

  afterEach(async () => {
    await client.close();
  });

  test("should connect to HTTP/1.1 server", async () => {
    const response = await client.get("http://httpbin.org/get");
    expect(response.getStatus()).toBe(200);
    expect(response.getVersion()).toBe(HTTPVersion.HTTP_1_1);
  });

  test("should send POST with body", async () => {
    const response = await client.post("http://httpbin.org/post", {
      body: { test: "data" }
    });
    expect(response.getStatus()).toBe(200);
    const body = response.getBodyAsJSON();
    expect(body.json).toEqual({ test: "data" });
  });

  test("should handle headers", async () => {
    const response = await client.get("http://httpbin.org/headers", {
      headers: { "X-Test": "value" }
    });
    expect(response.getStatus()).toBe(200);
    const body = response.getBodyAsJSON();
    expect(body.headers["X-Test"]).toBe("value");
  });

  test("should handle query parameters", async () => {
    const response = await client.get("http://httpbin.org/get", {
      query: { key: "value", test: "123" }
    });
    expect(response.getStatus()).toBe(200);
    const body = response.getBodyAsJSON();
    expect(body.args.key).toBe("value");
    expect(body.args.test).toBe("123");
  });

  test("should handle redirects", async () => {
    const response = await client.get("http://httpbin.org/redirect/1");
    expect(response.getStatus()).toBe(200);
  });

  test("should handle custom method via tunnel", async () => {
    const response = await client.ping("http://httpbin.org/get");
    expect(response.getStatus()).toBe(200);
  });
});