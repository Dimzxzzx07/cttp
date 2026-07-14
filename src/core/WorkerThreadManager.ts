import { ConfigTypes } from "../types/ConfigTypes";
import { Constants } from "./Constants";
import { SharedBufferPool } from "./SharedBufferPool";

export class WorkerThreadManager {
  private config: ConfigTypes.WorkerConfig;
  private constants: Constants;
  private sharedBufferPool: SharedBufferPool;
  private workers: Map<string, any>;
  private taskQueue: any[];
  private isRunning: boolean;

  constructor(config: ConfigTypes.WorkerConfig) {
    this.config = config;
    this.constants = new Constants();
    this.sharedBufferPool = new SharedBufferPool(config.bufferConfig);
    this.workers = new Map();
    this.taskQueue = [];
    this.isRunning = false;
  }

  public async createWorker(name: string, script: string): Promise<void> {
    const { Worker } = require("worker_threads");
    const worker = new Worker(script, {
      workerData: { name, config: this.config }
    });
    this.workers.set(name, worker);
  }

  public async runTask<T>(workerName: string, task: any): Promise<T> {
    const worker = this.workers.get(workerName);
    if (!worker) {
      throw new Error(`Worker ${workerName} not found`);
    }
    
    return new Promise((resolve, reject) => {
      const taskId = this.generateTaskId();
      const timeout = setTimeout(() => {
        reject(new Error("Task timeout"));
      }, this.config.taskTimeout || 30000);
      
      worker.postMessage({ taskId, task });
      worker.once("message", (result: any) => {
        clearTimeout(timeout);
        resolve(result);
      });
      worker.once("error", (err: any) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  }

  private generateTaskId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  public async executeInParallel<T>(
    tasks: any[],
    workerNames: string[]
  ): Promise<T[]> {
    const results: T[] = [];
    const promises = tasks.map((task, index) => {
      const workerName = workerNames[index % workerNames.length];
      return this.runTask<T>(workerName, task);
    });
    return Promise.all(promises);
  }

  public async executeInSequence<T>(
    tasks: any[],
    workerName: string
  ): Promise<T[]> {
    const results: T[] = [];
    for (const task of tasks) {
      const result = await this.runTask<T>(workerName, task);
      results.push(result);
    }
    return results;
  }

  public async shutdown(): Promise<void> {
    for (const [name, worker] of this.workers) {
      await worker.terminate();
    }
    this.workers.clear();
    this.taskQueue = [];
    this.isRunning = false;
  }

  public getWorkerCount(): number {
    return this.workers.size;
  }

  public getTaskQueueLength(): number {
    return this.taskQueue.length;
  }
}