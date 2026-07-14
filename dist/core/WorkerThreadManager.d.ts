import { ConfigTypes } from "../types/ConfigTypes";
export declare class WorkerThreadManager {
    private config;
    private constants;
    private sharedBufferPool;
    private workers;
    private taskQueue;
    private isRunning;
    constructor(config: ConfigTypes.WorkerConfig);
    createWorker(name: string, script: string): Promise<void>;
    runTask<T>(workerName: string, task: any): Promise<T>;
    private generateTaskId;
    executeInParallel<T>(tasks: any[], workerNames: string[]): Promise<T[]>;
    executeInSequence<T>(tasks: any[], workerName: string): Promise<T[]>;
    shutdown(): Promise<void>;
    getWorkerCount(): number;
    getTaskQueueLength(): number;
}
//# sourceMappingURL=WorkerThreadManager.d.ts.map