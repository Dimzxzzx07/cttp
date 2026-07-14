import { TokenManager } from "../../src/core/TokenManager";

describe("TokenManager", () => {
  let manager: TokenManager;

  beforeEach(() => {
    manager = new TokenManager({ refreshUrl: "/token/refresh" });
  });

  afterEach(async () => {
    await manager.close();
  });

  test("should create instance", () => {
    expect(manager).toBeDefined();
  });

  test("should not be authenticated initially", () => {
    expect(manager.isAuthenticated()).toBe(false);
  });

  test("should get current token", () => {
    const token = manager.getCurrentToken();
    expect(token).toBeUndefined();
  });

  test("should get access token", () => {
    const token = manager.getAccessToken();
    expect(token).toBeUndefined();
  });

  test("should get refresh token", () => {
    const token = manager.getRefreshToken();
    expect(token).toBeUndefined();
  });

  test("should detect expired token", () => {
    expect(manager.isExpired()).toBe(true);
  });
});