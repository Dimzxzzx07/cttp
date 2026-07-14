import { CTTPResponse } from "../../src/core/CTTPResponse";
import { HTTPVersion } from "../../src/core/HTTPVersion";

describe("CTTPResponse", () => {
  test("should create response with status", () => {
    const response = new CTTPResponse(
      200,
      "OK",
      HTTPVersion.HTTP_1_1,
      new Map([["Content-Type", "application/json"]]),
      { test: "data" }
    );
    expect(response.getStatus()).toBe(200);
    expect(response.getStatusText()).toBe("OK");
  });

  test("should detect success", () => {
    const response = new CTTPResponse(200, "OK", HTTPVersion.HTTP_1_1, new Map(), {});
    expect(response.isSuccess()).toBe(true);
    expect(response.isError()).toBe(false);
  });

  test("should detect error", () => {
    const response = new CTTPResponse(404, "Not Found", HTTPVersion.HTTP_1_1, new Map(), {});
    expect(response.isError()).toBe(true);
    expect(response.isClientError()).toBe(true);
  });

  test("should get body as string", () => {
    const response = new CTTPResponse(200, "OK", HTTPVersion.HTTP_1_1, new Map(), { test: "data" });
    expect(response.getBodyAsString()).toContain("test");
  });

  test("should get body as JSON", () => {
    const response = new CTTPResponse(200, "OK", HTTPVersion.HTTP_1_1, new Map(), { test: "data" });
    expect(response.getBodyAsJSON()).toEqual({ test: "data" });
  });

  test("should get headers", () => {
    const headers = new Map([["Content-Type", "application/json"]]);
    const response = new CTTPResponse(200, "OK", HTTPVersion.HTTP_1_1, headers, {});
    expect(response.getHeader("Content-Type")).toBe("application/json");
  });

  test("should clone response", () => {
    const response = new CTTPResponse(200, "OK", HTTPVersion.HTTP_1_1, new Map(), { test: "data" });
    const clone = response.clone();
    expect(clone.getStatus()).toBe(response.getStatus());
    expect(clone.getBody()).toEqual(response.getBody());
  });
});