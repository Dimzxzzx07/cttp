import { CTTPClient } from "../../src/core/CTTPClient";
import { HTTPMethod } from "../../src/core/HTTPMethod";

describe("CTTPClient", () => {
  let client: CTTPClient;

  beforeEach(() => {
    client = new CTTPClient({ logLevel: "error" });
  });

  afterEach(async () => {
    await client.close();
  });

  test("should create instance", () => {
    expect(client).toBeDefined();
    expect(client.getState().connected).toBe(false);
  });

  test("should set and get config", () => {
    const config = { defaultTimeout: 5000 };
    client.setConfig(config);
    expect(client.getConfig().defaultTimeout).toBe(5000);
  });

  test("should emit events", (done) => {
    client.on("test", (data: any) => {
      expect(data).toBe("test-data");
      done();
    });
    client.emit("test", "test-data");
  });

  test("should handle ping", async () => {
    const result = await client.pingHealth("http://localhost:9999");
    expect(result).toBe(false);
  });

  test("should get state", () => {
    const state = client.getState();
    expect(state.requestCount).toBe(0);
    expect(state.errorCount).toBe(0);
  });
});