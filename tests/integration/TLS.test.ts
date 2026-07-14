import { CTTPClient } from "../../src/core/CTTPClient";
import { HTTPVersion } from "../../src/core/HTTPVersion";

describe("TLS Integration", () => {
  let client: CTTPClient;

  beforeEach(() => {
    client = new CTTPClient({
      defaultVersion: HTTPVersion.HTTP_1_1,
      tlsConfig: {
        rejectUnauthorized: true,
        minVersion: "TLSv1.2",
        maxVersion: "TLSv1.3"
      },
      logLevel: "error"
    });
  });

  afterEach(async () => {
    await client.close();
  });

  test("should connect via TLS", async () => {
    const response = await client.get("https://httpbin.org/get");
    expect(response.getStatus()).toBe(200);
  });

  test("should handle TLS 1.3", async () => {
    const response = await client.get("https://tls13.akamai.net");
    expect(response.getStatus()).toBe(200);
  });

  test("should reject invalid certificate", async () => {
    const client2 = new CTTPClient({
      tlsConfig: {
        rejectUnauthorized: true
      },
      logLevel: "error"
    });
    await expect(client2.get("https://self-signed.badssl.com")).rejects.toThrow();
    await client2.close();
  });

  test("should accept self-signed with config", async () => {
    const client2 = new CTTPClient({
      tlsConfig: {
        rejectUnauthorized: false
      },
      logLevel: "error"
    });
    const response = await client2.get("https://self-signed.badssl.com");
    expect(response.getStatus()).toBe(200);
    await client2.close();
  });
});