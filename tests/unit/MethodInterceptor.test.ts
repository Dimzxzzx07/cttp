import { MethodInterceptor } from "../../src/core/MethodInterceptor";
import { HTTPMethod } from "../../src/core/HTTPMethod";

describe("MethodInterceptor", () => {
  let interceptor: MethodInterceptor;

  beforeEach(() => {
    interceptor = new MethodInterceptor({ tunnelMode: true, extensionMode: false });
  });

  test("should intercept custom method", () => {
    const headers = new Map<string, string>();
    const result = interceptor.intercept(HTTPMethod.LOGIN, headers);
    expect(result).toBe(HTTPMethod.POST);
    expect(headers.get("X-HTTP-Method")).toBe("LOGIN");
  });

  test("should not intercept standard method", () => {
    const headers = new Map<string, string>();
    const result = interceptor.intercept(HTTPMethod.GET, headers);
    expect(result).toBe(HTTPMethod.GET);
    expect(headers.get("X-HTTP-Method")).toBeUndefined();
  });

  test("should add custom method", () => {
    interceptor.addCustomMethod("CUSTOM");
    expect(interceptor.getCustomMethods()).toContain("CUSTOM");
  });

  test("should remove custom method", () => {
    interceptor.addCustomMethod("CUSTOM");
    interceptor.removeCustomMethod("CUSTOM");
    expect(interceptor.getCustomMethods()).not.toContain("CUSTOM");
  });

  test("should check method support", () => {
    expect(interceptor.isMethodSupported("LOGIN")).toBe(true);
    expect(interceptor.isMethodSupported("CUSTOM")).toBe(false);
  });
});