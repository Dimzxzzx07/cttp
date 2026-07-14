/// <reference types="node" />
/// <reference types="node" />
export declare class BunAdapter {
    private bun;
    constructor();
    getBun(): any;
    readFile(path: string): Promise<Buffer>;
    writeFile(path: string, data: Buffer): Promise<void>;
    connect(host: string, port: number): Promise<any>;
    listen(host: string, port: number): Promise<any>;
    getVersion(): string;
    getEnv(key: string): string | undefined;
    isAvailable(): boolean;
}
//# sourceMappingURL=BunAdapter.d.ts.map