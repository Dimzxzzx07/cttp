"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskScheduler = void 0;
class TaskScheduler {
    constructor() {
        this.tasks = new Map();
        this.running = new Map();
        this.maxConcurrent = 10;
        this.activeCount = 0;
        this.queue = [];
        this.isProcessing = false;
    }
    schedule(task, priority = 0) {
        const id = this.generateTaskId();
        const scheduled = {
            id,
            task,
            priority,
            status: "pending",
            createdAt: Date.now()
        };
        this.tasks.set(id, scheduled);
        this.queue.push(scheduled);
        this.sortQueue();
        this.processQueue();
        return id;
    }
    async execute(taskId) {
        const scheduled = this.tasks.get(taskId);
        if (!scheduled) {
            throw new Error("Task not found");
        }
        this.running.set(taskId, true);
        scheduled.status = "running";
        try {
            const result = await scheduled.task();
            scheduled.result = result;
            scheduled.status = "completed";
            scheduled.completedAt = Date.now();
            return result;
        }
        catch (error) {
            scheduled.status = "failed";
            scheduled.error = error;
            throw error;
        }
        finally {
            this.running.set(taskId, false);
            this.activeCount--;
            this.processQueue();
        }
    }
    processQueue() {
        if (this.isProcessing)
            return;
        this.isProcessing = true;
        while (this.activeCount < this.maxConcurrent && this.queue.length > 0) {
            const task = this.queue.shift();
            if (task) {
                this.activeCount++;
                this.execute(task.id).catch(() => { });
            }
        }
        this.isProcessing = false;
    }
    sortQueue() {
        this.queue.sort((a, b) => b.priority - a.priority);
    }
    generateTaskId() {
        return Date.now() + "-" + Math.random().toString(36).substring(2, 15);
    }
    cancel(taskId) {
        const scheduled = this.tasks.get(taskId);
        if (scheduled) {
            scheduled.status = "cancelled";
            this.running.set(taskId, false);
            const index = this.queue.findIndex(t => t.id === taskId);
            if (index !== -1) {
                this.queue.splice(index, 1);
            }
        }
    }
    getTask(taskId) {
        return this.tasks.get(taskId);
    }
    getTasks() {
        return Array.from(this.tasks.values());
    }
    getPendingTasks() {
        return Array.from(this.tasks.values()).filter(t => t.status === "pending");
    }
    getRunningTasks() {
        return Array.from(this.tasks.values()).filter(t => t.status === "running");
    }
    getCompletedTasks() {
        return Array.from(this.tasks.values()).filter(t => t.status === "completed");
    }
    getFailedTasks() {
        return Array.from(this.tasks.values()).filter(t => t.status === "failed");
    }
    clear() {
        this.tasks.clear();
        this.running.clear();
        this.queue = [];
        this.activeCount = 0;
    }
    setMaxConcurrent(max) {
        this.maxConcurrent = Math.max(1, max);
    }
}
exports.TaskScheduler = TaskScheduler;
//# sourceMappingURL=TaskScheduler.js.map