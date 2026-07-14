export class WorkerAdapter {
  private isWorker: boolean;
  private isMain: boolean;

  constructor() {
    const isNode = typeof process !== "undefined" && process.versions && process.versions.node;
    const isDeno = typeof Deno !== "undefined";
    const isBun = typeof Bun !== "undefined";

    if (isNode) {
      try {
        const workerThreads = require("worker_threads");
        this.isWorker = workerThreads.isMainThread === false;
        this.isMain = workerThreads.isMainThread === true;
      } catch {
        this.isWorker = false;
        this.isMain = true;
      }
    } else if (isDeno) {
      this.isWorker = false;
      this.isMain = true;
    } else if (isBun) {
      this.isWorker = false;
      this.isMain = true;
    } else {
      this.isWorker = false;
      this.isMain = true;
    }
  }

  public isWorkerThread(): boolean {
    return this.isWorker;
  }

  public isMainThread(): boolean {
    return this.isMain;
  }

  public async runInWorker(script: string, data?: any): Promise<any> {
    if (!this.isMain) {
      return null;
    }

    const isNode = typeof process !== "undefined" && process.versions && process.versions.node;
    if (isNode) {
      try {
        const { Worker } = require("worker_threads");
        return new Promise((resolve, reject) => {
          const worker = new Worker(script, { workerData: data });
          worker.on("message", resolve);
          worker.on("error", reject);
          worker.on("exit", (code: number) => {
            if (code !== 0) {
              reject(new Error("Worker stopped with exit code " + code));
            }
          });
        });
      } catch {
        return null;
      }
    }

    return null;
  }

  public getParentPort(): any {
    if (!this.isWorker) {
      return null;
    }

    const isNode = typeof process !== "undefined" && process.versions && process.versions.node;
    if (isNode) {
      try {
        const { parentPort } = require("worker_threads");
        return parentPort;
      } catch {
        return null;
      }
    }

    return null;
  }

  public getWorkerData(): any {
    if (!this.isWorker) {
      return null;
    }

    const isNode = typeof process !== "undefined" && process.versions && process.versions.node;
    if (isNode) {
      try {
        const { workerData } = require("worker_threads");
        return workerData;
      } catch {
        return null;
      }
    }

    return null;
  }
}
