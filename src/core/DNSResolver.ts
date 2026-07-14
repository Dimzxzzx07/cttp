import { ConfigTypes } from "../types/ConfigTypes";
import { Constants } from "./Constants";
import { LRUCache } from "../utils/LRUCache";
import { TimerWheel } from "../utils/TimerWheel";

export class DNSResolver {
  private config: ConfigTypes.DNSConfig;
  private constants: Constants;
  private cache: LRUCache<string, any>;
  private timerWheel: TimerWheel;
  private ttl: number;
  private timeout: number;

  constructor(config: ConfigTypes.DNSConfig) {
    this.config = config;
    this.constants = new Constants();
    this.cache = new LRUCache(config.cacheSize || 1000);
    this.timerWheel = new TimerWheel();
    this.ttl = config.ttl || 300;
    this.timeout = config.timeout || 5000;
  }

  public async resolve(hostname: string): Promise<string[]> {
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

  private async lookup(hostname: string): Promise<string[]> {
    const dns = require("dns");
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("DNS lookup timeout"));
      }, this.timeout);
      
      dns.lookup(hostname, { all: true }, (err: any, addresses: any[]) => {
        clearTimeout(timeout);
        if (err) {
          reject(err);
        } else {
          resolve(addresses.map(addr => addr.address));
        }
      });
    });
  }

  public async resolveSRV(service: string, protocol: string, domain: string): Promise<any[]> {
    const dns = require("dns");
    const key = `_${service}._${protocol}.${domain}`;
    const cached = this.cache.get(key);
    if (cached) {
      return cached.records;
    }
    
    return new Promise((resolve, reject) => {
      dns.resolveSrv(key, (err: any, records: any[]) => {
        if (err) {
          reject(err);
        } else {
          this.cache.set(key, {
            records,
            timestamp: Date.now()
          });
          resolve(records);
        }
      });
    });
  }

  public async resolveTXT(domain: string): Promise<string[][]> {
    const dns = require("dns");
    const cached = this.cache.get(`txt:${domain}`);
    if (cached) {
      return cached.records;
    }
    
    return new Promise((resolve, reject) => {
      dns.resolveTxt(domain, (err: any, records: string[][]) => {
        if (err) {
          reject(err);
        } else {
          this.cache.set(`txt:${domain}`, {
            records,
            timestamp: Date.now()
          });
          resolve(records);
        }
      });
    });
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public getCacheSize(): number {
    return this.cache.size();
  }
}