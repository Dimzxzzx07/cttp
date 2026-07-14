export class BunAdapter {
  private bun: any;

  constructor() {
    this.bun = typeof Bun !== "undefined" ? Bun : null;
  }

  public getBun(): any {
    return this.bun;
  }

  public async readFile(path: string): Promise<Buffer> {
    if (!this.bun) {
      throw new Error("Bun not available");
    }
    return this.bun.file(path).arrayBuffer();
  }

  public async writeFile(path: string, data: Buffer): Promise<void> {
    if (!this.bun) {
      throw new Error("Bun not available");
    }
    await this.bun.write(path, data);
  }

  public async connect(host: string, port: number): Promise<any> {
    if (!this.bun) {
      throw new Error("Bun not available");
    }
    return this.bun.connect({ hostname: host, port });
  }

  public async listen(host: string, port: number): Promise<any> {
    if (!this.bun) {
      throw new Error("Bun not available");
    }
    return this.bun.listen({ hostname: host, port });
  }

  public getVersion(): string {
    if (!this.bun) {
      return "unknown";
    }
    return this.bun.version;
  }

  public getEnv(key: string): string | undefined {
    if (!this.bun) {
      return undefined;
    }
    return this.bun.env[key];
  }

  public isAvailable(): boolean {
    return this.bun !== null;
  }
}