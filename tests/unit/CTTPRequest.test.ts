import { CTTPRequest } from "../../src/core/CTTPRequest";
import { HTTPMethod } from "../../src/core/HTTPMethod";
import { HTTPVersion } from "../../src/core/HTTPVersion";

describe("CTTPRequest", () => {
  test("should create request with method and url", () => {
    const request = new CTTPRequest(HTTPMethod.GET, "http://example.com");
    expect(request.getMethod()).toBe(HTTPMethod.GET);
    expect(request.getURL()).toContain("example.com");
  });

  test("should set and get body", () => {
    const request = new CTTPRequest(HTTPMethod.POST, "http://example.com");
    const body = { test: "data" };
    request.setBody(body);
    expect(request.getBody()).toEqual(body);
  });

  test("should set and get headers", () => {
    const request = new CTTPRequest(HTTPMethod.GET, "http://example.com");
    const headers = new Map([["X-Test", "value"]]);
    request.setHeaders(headers);
    expect(request.getHeaders().get("X-Test")).toBe("value");
  });

  test("should set and get timeout", () => {
    const request = new CTTPRequest(HTTPMethod.GET, "http://example.com");
    request.setTimeout(5000);
    expect(request.getTimeout()).toBe(5000);
  });

  test("should set and get version", () => {
    const request = new CTTPRequest(HTTPMethod.GET, "http://example.com");
    request.setVersion(HTTPVersion.HTTP_2);
    expect(request.getVersion()).toBe(HTTPVersion.HTTP_2);
  });

  test("should clone request", () => {
    const request = new CTTPRequest(HTTPMethod.GET, "http://example.com");
    request.setBody({ test: "data" });
    const clone = request.clone();
    expect(clone.getMethod()).toBe(request.getMethod());
    expect(clone.getBody()).toEqual(request.getBody());
  });

  test("should generate id", () => {
    const request = new CTTPRequest(HTTPMethod.GET, "http://example.com");
    expect(request.getId()).toBeDefined();
    expect(request.getId()).toMatch(/^\d+-[a-z0-9]+$/);
  });
});