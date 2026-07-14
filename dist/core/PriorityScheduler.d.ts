export declare class PriorityScheduler {
    private priorities;
    private queues;
    private maxPriority;
    private minPriority;
    private isProcessing;
    constructor();
    private initializeQueues;
    addTask(task: any, priority: number): void;
    getNextTask(): any | null;
    getPriority(taskId: string): number | undefined;
    updatePriority(taskId: string, newPriority: number): void;
    removeTask(taskId: string): void;
    getQueueSize(priority: number): number;
    getTotalSize(): number;
    clear(): void;
    setPriorityRange(min: number, max: number): void;
    getMinPriority(): number;
    getMaxPriority(): number;
}
//# sourceMappingURL=PriorityScheduler.d.ts.map