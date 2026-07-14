export class ServerPushManager {
  private pushPromises: Map<string, any>;
  private pushCache: Map<string, any>;
  private enabled: boolean;
  private maxConcurrentPushes: number;
  private activePushes: number;

  constructor() {
    this.pushPromises = new Map();
    this.pushCache = new Map();
    this.enabled = true;
    this.maxConcurrentPushes = 10;
    this.activePushes = 0;
  }

  public async push(streamId: number, url: string, headers: Map<string, string>): Promise<void> {
    if (!this.enabled) {
      return;
    }

    const pushId = this.generatePushId(streamId, url);
    if (this.pushPromises.has(pushId)) {
      return;
    }

    if (this.activePushes >= this.maxConcurrentPushes) {
      await this.waitForPushSlot();
    }

    this.activePushes++;
    const promise = this.executePush(streamId, url, headers);
    this.pushPromises.set(pushId, promise);

    try {
      await promise;
    } finally {
      this.activePushes--;
      this.pushPromises.delete(pushId);
    }
  }

  private async executePush(streamId: number, url: string, headers: Map<string, string>): Promise<void> {
    const cached = this.pushCache.get(url);
    if (cached) {
      return;
    }

    const response = await this.fetchResource(url, headers);
    this.pushCache.set(url, response);

    if (this.pushCache.size > 100) {
      const firstKey = this.pushCache.keys().next().value;
      if (firstKey) {
        this.pushCache.delete(firstKey);
      }
    }
  }

  private async fetchResource(url: string, headers: Map<string, string>): Promise<any> {
    return {
      url,
      headers,
      status: 200,
      body: Buffer.from("pushed content"),
      timestamp: Date.now()
    };
  }

  private async waitForPushSlot(): Promise<void> {
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (this.activePushes < this.maxConcurrentPushes) {
          clearInterval(check);
          resolve();
        }
      }, 10);
    });
  }

  private generatePushId(streamId: number, url: string): string {
    return `${streamId}:${url}`;
  }

  public enable(): void {
    this.enabled = true;
  }

  public disable(): void {
    this.enabled = false;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setMaxConcurrentPushes(max: number): void {
    this.maxConcurrentPushes = Math.max(1, max);
  }

  public getMaxConcurrentPushes(): number {
    return this.maxConcurrentPushes;
  }

  public getActivePushes(): number {
    return this.activePushes;
  }

  public getCacheSize(): number {
    return this.pushCache.size;
  }

  public clearCache(): void {
    this.pushCache.clear();
  }

  public getPushPromises(): number {
    return this.pushPromises.size;
  }
}