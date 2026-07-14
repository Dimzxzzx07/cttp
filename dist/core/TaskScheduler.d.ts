export declare class TaskScheduler {
    private tasks;
    private running;
    private maxConcurrent;
    private activeCount;
    private queue;
    private isProcessing;
    constructor();
    schedule(task: any, priority?: number): string;
    execute(taskId: string): Promise<any>;
    private processQueue;
    private sortQueue;
    private generateTaskId;
    cancel(taskId: string): void;
    getTask(taskId: string): any;
    getTasks(): any[];
    getPendingTasks(): any[];
    getRunningTasks(): any[];
    getCompletedTasks(): any[];
    getFailedTasks(): any[];
    clear(): void;
    setMaxConcurrent(max: number): void;
}
//# sourceMappingURL=TaskScheduler.d.ts.map