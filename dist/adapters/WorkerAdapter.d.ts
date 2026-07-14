export declare class WorkerAdapter {
    private isWorker;
    private isMain;
    constructor();
    isWorkerThread(): boolean;
    isMainThread(): boolean;
    runInWorker(script: string, data?: any): Promise<any>;
    getParentPort(): any;
    getWorkerData(): any;
}
//# sourceMappingURL=WorkerAdapter.d.ts.map