"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerThreadManager = void 0;
const Constants_1 = require("./Constants");
const SharedBufferPool_1 = require("./SharedBufferPool");
class WorkerThreadManager {
    constructor(config) {
        this.config = config;
        this.constants = new Constants_1.Constants();
        this.sharedBufferPool = new SharedBufferPool_1.SharedBufferPool(config.bufferConfig);
        this.workers = new Map();
        this.taskQueue = [];
        this.isRunning = false;
    }
    async createWorker(name, script) {
        const { Worker } = require("worker_threads");
        const worker = new Worker(script, {
            workerData: { name, config: this.config }
        });
        this.workers.set(name, worker);
    }
    async runTask(workerName, task) {
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
            worker.once("message", (result) => {
                clearTimeout(timeout);
                resolve(result);
            });
            worker.once("error", (err) => {
                clearTimeout(timeout);
                reject(err);
            });
        });
    }
    generateTaskId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
    async executeInParallel(tasks, workerNames) {
        const results = [];
        const promises = tasks.map((task, index) => {
            const workerName = workerNames[index % workerNames.length];
            return this.runTask(workerName, task);
        });
        return Promise.all(promises);
    }
    async executeInSequence(tasks, workerName) {
        const results = [];
        for (const task of tasks) {
            const result = await this.runTask(workerName, task);
            results.push(result);
        }
        return results;
    }
    async shutdown() {
        for (const [name, worker] of this.workers) {
            await worker.terminate();
        }
        this.workers.clear();
        this.taskQueue = [];
        this.isRunning = false;
    }
    getWorkerCount() {
        return this.workers.size;
    }
    getTaskQueueLength() {
        return this.taskQueue.length;
    }
}
exports.WorkerThreadManager = WorkerThreadManager;
//# sourceMappingURL=WorkerThreadManager.js.map