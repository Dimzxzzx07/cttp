"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DNSResolver = void 0;
const Constants_1 = require("./Constants");
const LRUCache_1 = require("../utils/LRUCache");
const TimerWheel_1 = require("../utils/TimerWheel");
class DNSResolver {
    constructor(config) {
        this.config = config;
        this.constants = new Constants_1.Constants();
        this.cache = new LRUCache_1.LRUCache(config.cacheSize || 1000);
        this.timerWheel = new TimerWheel_1.TimerWheel();
        this.ttl = config.ttl || 300;
        this.timeout = config.timeout || 5000;
    }
    async resolve(hostname) {
        const cached = this.cache.get(hostname);
        if (cached) {
            return cached.addresses;
        }
        const addresses = await this.lookup(hostname);
        this.cache.set(hostname, {
            addresses,
            timestamp: Date.now()
        });
        this.timerWheel.schedule(() => this.cache.delete(hostname), this.ttl * 1000);
        return addresses;
    }
    async lookup(hostname) {
        const dns = require("dns");
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error("DNS lookup timeout"));
            }, this.timeout);
            dns.lookup(hostname, { all: true }, (err, addresses) => {
                clearTimeout(timeout);
                if (err) {
                    reject(err);
                }
                else {
                    resolve(addresses.map(addr => addr.address));
                }
            });
        });
    }
    async resolveSRV(service, protocol, domain) {
        const dns = require("dns");
        const key = `_${service}._${protocol}.${domain}`;
        const cached = this.cache.get(key);
        if (cached) {
            return cached.records;
        }
        return new Promise((resolve, reject) => {
            dns.resolveSrv(key, (err, records) => {
                if (err) {
                    reject(err);
                }
                else {
                    this.cache.set(key, {
                        records,
                        timestamp: Date.now()
                    });
                    resolve(records);
                }
            });
        });
    }
    async resolveTXT(domain) {
        const dns = require("dns");
        const cached = this.cache.get(`txt:${domain}`);
        if (cached) {
            return cached.records;
        }
        return new Promise((resolve, reject) => {
            dns.resolveTxt(domain, (err, records) => {
                if (err) {
                    reject(err);
                }
                else {
                    this.cache.set(`txt:${domain}`, {
                        records,
                        timestamp: Date.now()
                    });
                    resolve(records);
                }
            });
        });
    }
    clearCache() {
        this.cache.clear();
    }
    getCacheSize() {
        return this.cache.size();
    }
}
exports.DNSResolver = DNSResolver;
//# sourceMappingURL=DNSResolver.js.map