export declare class DenoAdapter {
    private deno;
    constructor();
    getDeno(): any;
    readFile(path: string): Promise<Uint8Array>;
    writeFile(path: string, data: Uint8Array): Promise<void>;
    connect(host: string, port: number): Promise<any>;
    listen(host: string, port: number): Promise<any>;
    resolve(host: string): Promise<any>;
    getVersion(): string;
    getArgs(): string[];
    getEnv(key: string): string | undefined;
    isAvailable(): boolean;
}
//# sourceMappingURL=DenoAdapter.d.ts.map