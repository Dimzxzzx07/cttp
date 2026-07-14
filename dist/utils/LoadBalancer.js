"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadBalancer = void 0;
class LoadBalancer {
    constructor(strategy) {
        this.endpoints = [];
        this.currentIndex = 0;
        this.strategy = strategy || "round-robin";
        this.weights = new Map();
        this.healthStatus = new Map();
    }
    addEndpoint(url, weight) {
        this.endpoints.push({ url, weight: weight || 1 });
        this.weights.set(url, weight || 1);
        this.healthStatus.set(url, true);
    }
    removeEndpoint(url) {
        const index = this.endpoints.findIndex(e => e.url === url);
        if (index !== -1) {
            this.endpoints.splice(index, 1);
            this.weights.delete(url);
            this.healthStatus.delete(url);
        }
    }
    getEndpoint() {
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
    roundRobin(endpoints) {
        if (endpoints.length === 0) {
            return null;
        }
        const endpoint = endpoints[this.currentIndex % endpoints.length];
        this.currentIndex++;
        return endpoint.url;
    }
    weighted(endpoints) {
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
    leastConnections(endpoints) {
        return endpoints.reduce((a, b) => {
            const aConn = a.connections || 0;
            const bConn = b.connections || 0;
            return aConn < bConn ? a : b;
        }).url;
    }
    random(endpoints) {
        const index = Math.floor(Math.random() * endpoints.length);
        return endpoints[index].url;
    }
    setHealth(url, healthy) {
        this.healthStatus.set(url, healthy);
    }
    getHealth(url) {
        return this.healthStatus.get(url) || false;
    }
    getStrategy() {
        return this.strategy;
    }
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    getEndpoints() {
        return this.endpoints.map(e => e.url);
    }
    getWeight(url) {
        return this.weights.get(url) || 1;
    }
    setWeight(url, weight) {
        const endpoint = this.endpoints.find(e => e.url === url);
        if (endpoint) {
            endpoint.weight = weight;
            this.weights.set(url, weight);
        }
    }
    getHealthyEndpoints() {
        return this.endpoints
            .filter(e => this.healthStatus.get(e.url))
            .map(e => e.url);
    }
    getUnhealthyEndpoints() {
        return this.endpoints
            .filter(e => !this.healthStatus.get(e.url))
            .map(e => e.url);
    }
    clear() {
        this.endpoints = [];
        this.currentIndex = 0;
        this.weights.clear();
        this.healthStatus.clear();
    }
}
exports.LoadBalancer = LoadBalancer;
//# sourceMappingURL=LoadBalancer.js.map