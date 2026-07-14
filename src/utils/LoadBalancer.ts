export class LoadBalancer {
  private endpoints: any[];
  private currentIndex: number;
  private strategy: string;
  private weights: Map<string, number>;
  private healthStatus: Map<string, boolean>;

  constructor(strategy?: string) {
    this.endpoints = [];
    this.currentIndex = 0;
    this.strategy = strategy || "round-robin";
    this.weights = new Map();
    this.healthStatus = new Map();
  }

  public addEndpoint(url: string, weight?: number): void {
    this.endpoints.push({ url, weight: weight || 1 });
    this.weights.set(url, weight || 1);
    this.healthStatus.set(url, true);
  }

  public removeEndpoint(url: string): void {
    const index = this.endpoints.findIndex(e => e.url === url);
    if (index !== -1) {
      this.endpoints.splice(index, 1);
      this.weights.delete(url);
      this.healthStatus.delete(url);
    }
  }

  public getEndpoint(): string | null {
    const healthy = this.endpoints.filter(e => this.healthStatus.get(e.url));
    if (healthy.length === 0) {
      return null;
    }

    switch (this.strategy) {
      case "round-robin":
        return this.roundRobin(healthy);
      case "weighted":
        return this.weighted(healthy);
      case "least-connections":
        return this.leastConnections(healthy);
      case "random":
        return this.random(healthy);
      default:
        return this.roundRobin(healthy);
    }
  }

  private roundRobin(endpoints: any[]): string {
    if (endpoints.length === 0) {
      return null;
    }
    const endpoint = endpoints[this.currentIndex % endpoints.length];
    this.currentIndex++;
    return endpoint.url;
  }

  private weighted(endpoints: any[]): string {
    const totalWeight = endpoints.reduce((sum, e) => sum + (e.weight || 1), 0);
    let random = Math.random() * totalWeight;
    for (const endpoint of endpoints) {
      const weight = endpoint.weight || 1;
      random -= weight;
      if (random <= 0) {
        return endpoint.url;
      }
    }
    return endpoints[0]?.url || null;
  }

  private leastConnections(endpoints: any[]): string {
    return endpoints.reduce((a, b) => {
      const aConn = a.connections || 0;
      const bConn = b.connections || 0;
      return aConn < bConn ? a : b;
    }).url;
  }

  private random(endpoints: any[]): string {
    const index = Math.floor(Math.random() * endpoints.length);
    return endpoints[index].url;
  }

  public setHealth(url: string, healthy: boolean): void {
    this.healthStatus.set(url, healthy);
  }

  public getHealth(url: string): boolean {
    return this.healthStatus.get(url) || false;
  }

  public getStrategy(): string {
    return this.strategy;
  }

  public setStrategy(strategy: string): void {
    this.strategy = strategy;
  }

  public getEndpoints(): string[] {
    return this.endpoints.map(e => e.url);
  }

  public getWeight(url: string): number {
    return this.weights.get(url) || 1;
  }

  public setWeight(url: string, weight: number): void {
    const endpoint = this.endpoints.find(e => e.url === url);
    if (endpoint) {
      endpoint.weight = weight;
      this.weights.set(url, weight);
    }
  }

  public getHealthyEndpoints(): string[] {
    return this.endpoints
      .filter(e => this.healthStatus.get(e.url))
      .map(e => e.url);
  }

  public getUnhealthyEndpoints(): string[] {
    return this.endpoints
      .filter(e => !this.healthStatus.get(e.url))
      .map(e => e.url);
  }

  public clear(): void {
    this.endpoints = [];
    this.currentIndex = 0;
    this.weights.clear();
    this.healthStatus.clear();
  }
}