declare const Deno: any;
declare const Bun: any;
declare module "worker_threads" {
  export const isMainThread: boolean;
  export const parentPort: any;
  export const workerData: any;
  export class Worker {
    constructor(filename: string, options?: any);
    postMessage(data: any): void;
    on(event: string, listener: (...args: any[]) => void): void;
    once(event: string, listener: (...args: any[]) => void): void;
    terminate(): Promise<void>;
  }
}
