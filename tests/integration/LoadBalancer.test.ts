import { LoadBalancer } from "../../src/utils/LoadBalancer";

describe("LoadBalancer Integration", () => {
  let loadBalancer: LoadBalancer;

  beforeEach(() => {
    loadBalancer = new LoadBalancer("round-robin");
    loadBalancer.addEndpoint("http://localhost:3001");
    loadBalancer.addEndpoint("http://localhost:3002");
    loadBalancer.addEndpoint("http://localhost:3003");
  });

  test("should get endpoint round-robin", () => {
    const endpoints = [];
    for (let i = 0; i < 6; i++) {
      endpoints.push(loadBalancer.getEndpoint());
    }
    expect(endpoints).toContain("http://localhost:3001");
    expect(endpoints).toContain("http://localhost:3002");
    expect(endpoints).toContain("http://localhost:3003");
  });

  test("should handle health status", () => {
    loadBalancer.setHealth("http://localhost:3002", false);
    const endpoints = [];
    for (let i = 0; i < 4; i++) {
      const ep = loadBalancer.getEndpoint();
      if (ep) endpoints.push(ep);
    }
    expect(endpoints).not.toContain("http://localhost:3002");
    expect(endpoints).toContain("http://localhost:3001");
    expect(endpoints).toContain("http://localhost:3003");
  });

  test("should get healthy endpoints", () => {
    loadBalancer.setHealth("http://localhost:3002", false);
    const healthy = loadBalancer.getHealthyEndpoints();
    expect(healthy).not.toContain("http://localhost:3002");
    expect(healthy).toContain("http://localhost:3001");
    expect(healthy).toContain("http://localhost:3003");
  });

  test("should get unhealthy endpoints", () => {
    loadBalancer.setHealth("http://localhost:3002", false);
    const unhealthy = loadBalancer.getUnhealthyEndpoints();
    expect(unhealthy).toContain("http://localhost:3002");
  });

  test("should set strategy", () => {
    loadBalancer.setStrategy("weighted");
    expect(loadBalancer.getStrategy()).toBe("weighted");
  });

  test("should set weight", () => {
    loadBalancer.setWeight("http://localhost:3001", 2);
    expect(loadBalancer.getWeight("http://localhost:3001")).toBe(2);
  });
});