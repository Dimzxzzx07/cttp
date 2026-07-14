import { HTTPTunnel } from "../../src/core/HTTPTunnel";
import { CTTPRequest } from "../../src/core/CTTPRequest";
import { HTTPMethod } from "../../src/core/HTTPMethod";

describe("HTTPTunnel", () => {
  let tunnel: HTTPTunnel;

  beforeEach(() => {
    tunnel = new HTTPTunnel({
      encrypt: false,
      encryptionKey: "",
      poolConfig: { maxConnections: 5 },
      tlsConfig: { rejectUnauthorized: false }
    });
  });

  afterEach(async () => {
    await tunnel.close();
  });

  test("should create instance", () => {
    expect(tunnel).toBeDefined();
  });

  test("should get active tunnels", () => {
    expect(tunnel.getActiveTunnels()).toBe(0);
  });

  test("should handle health check", async () => {
    const result = await tunnel.healthCheck();
    expect(result).toBe(true);
  });
});