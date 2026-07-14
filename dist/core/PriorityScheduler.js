"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriorityScheduler = void 0;
class PriorityScheduler {
    constructor() {
        this.priorities = new Map();
        this.queues = new Map();
        this.maxPriority = 10;
        this.minPriority = 0;
        this.isProcessing = false;
        this.initializeQueues();
    }
    initializeQueues() {
        for (let i = this.minPriority; i <= this.maxPriority; i++) {
            this.queues.set(i, []);
        }
    }
    addTask(task, priority) {
        const p = Math.max(this.minPriority, Math.min(this.maxPriority, priority));
        const queue = this.queues.get(p);
        if (queue) {
            queue.push(task);
            this.priorities.set(task.id || task, p);
        }
    }
    getNextTask() {
        for (let i = this.maxPriority; i >= this.minPriority; i--) {
            const queue = this.queues.get(i);
            if (queue && queue.length > 0) {
                const task = queue.shift();
                if (task) {
                    this.priorities.delete(task.id || task);
                    return task;
                }
            }
        }
        return null;
    }
    getPriority(taskId) {
        return this.priorities.get(taskId);
    }
    updatePriority(taskId, newPriority) {
        const oldPriority = this.priorities.get(taskId);
        if (oldPriority !== undefined) {
            const oldQueue = this.queues.get(oldPriority);
            if (oldQueue) {
                const index = oldQueue.findIndex(t => (t.id || t) === taskId);
                if (index !== -1) {
                    const task = oldQueue.splice(index, 1)[0];
                    const p = Math.max(this.minPriority, Math.min(this.maxPriority, newPriority));
                    const newQueue = this.queues.get(p);
                    if (newQueue) {
                        newQueue.push(task);
                        this.priorities.set(taskId, p);
                    }
                }
            }
        }
    }
    removeTask(taskId) {
        const priority = this.priorities.get(taskId);
        if (priority !== undefined) {
            const queue = this.queues.get(priority);
            if (queue) {
                const index = queue.findIndex(t => (t.id || t) === taskId);
                if (index !== -1) {
                    queue.splice(index, 1);
                    this.priorities.delete(taskId);
                }
            }
        }
    }
    getQueueSize(priority) {
        const queue = this.queues.get(priority);
        return queue ? queue.length : 0;
    }
    getTotalSize() {
        let total = 0;
        for (const queue of this.queues.values()) {
            total += queue.length;
        }
        return total;
    }
    clear() {
        for (const queue of this.queues.values()) {
            queue.length = 0;
        }
        this.priorities.clear();
    }
    setPriorityRange(min, max) {
        this.minPriority = min;
        this.maxPriority = max;
        this.initializeQueues();
    }
    getMinPriority() {
        return this.minPriority;
    }
    getMaxPriority() {
        return this.maxPriority;
    }
}
exports.PriorityScheduler = PriorityScheduler;
//# sourceMappingURL=PriorityScheduler.js.map