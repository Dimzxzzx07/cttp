export class DenoAdapter {
  private deno: any;

  constructor() {
    this.deno = typeof Deno !== "undefined" ? Deno : null;
  }

  public getDeno(): any {
    return this.deno;
  }

  public async readFile(path: string): Promise<Uint8Array> {
    if (!this.deno) {
      throw new Error("Deno not available");
    }
    return this.deno.readFile(path);
  }

  public async writeFile(path: string, data: Uint8Array): Promise<void> {
    if (!this.deno) {
      throw new Error("Deno not available");
    }
    return this.deno.writeFile(path, data);
  }

  public async connect(host: string, port: number): Promise<any> {
    if (!this.deno) {
      throw new Error("Deno not available");
    }
    return this.deno.connect({ hostname: host, port });
  }

  public async listen(host: string, port: number): Promise<any> {
    if (!this.deno) {
      throw new Error("Deno not available");
    }
    return this.deno.listen({ hostname: host, port });
  }

  public async resolve(host: string): Promise<any> {
    if (!this.deno) {
      throw new Error("Deno not available");
    }
    return this.deno.resolveDns(host);
  }

  public getVersion(): string {
    if (!this.deno) {
      return "unknown";
    }
    return this.deno.version.deno;
  }

  public getArgs(): string[] {
    if (!this.deno) {
      return [];
    }
    return this.deno.args;
  }

  public getEnv(key: string): string | undefined {
    if (!this.deno) {
      return undefined;
    }
    return this.deno.env.get(key);
  }

  public isAvailable(): boolean {
    return this.deno !== null;
  }
}