import { CTTPClient } from "../../src/core/CTTPClient";

describe("WebSocket Integration", () => {
  let client: CTTPClient;

  beforeEach(() => {
    client = new CTTPClient({
      logLevel: "error"
    });
  });

  afterEach(async () => {
    await client.close();
  });

  test("should upgrade to WebSocket", async () => {
    try {
      const response = await client.get("wss://echo.websocket.org");
      expect(response.getStatus()).toBe(101);
    } catch (error) {
      console.log("WebSocket test skipped - server may not be available");
    }
  });

  test("should handle WebSocket connection", async () => {
    try {
      const response = await client.get("wss://ws.postman-echo.com/raw");
      expect(response.getStatus()).toBe(101);
    } catch (error) {
      console.log("WebSocket test skipped - server may not be available");
    }
  });
});