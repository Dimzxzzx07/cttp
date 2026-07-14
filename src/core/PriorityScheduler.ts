export class PriorityScheduler {
  private priorities: Map<string, number>;
  private queues: Map<number, any[]>;
  private maxPriority: number;
  private minPriority: number;
  private isProcessing: boolean;

  constructor() {
    this.priorities = new Map();
    this.queues = new Map();
    this.maxPriority = 10;
    this.minPriority = 0;
    this.isProcessing = false;
    this.initializeQueues();
  }

  private initializeQueues(): void {
    for (let i = this.minPriority; i <= this.maxPriority; i++) {
      this.queues.set(i, []);
    }
  }

  public addTask(task: any, priority: number): void {
    const p = Math.max(this.minPriority, Math.min(this.maxPriority, priority));
    const queue = this.queues.get(p);
    if (queue) {
      queue.push(task);
      this.priorities.set(task.id || task, p);
    }
  }

  public getNextTask(): any | null {
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

  public getPriority(taskId: string): number | undefined {
    return this.priorities.get(taskId);
  }

  public updatePriority(taskId: string, newPriority: number): void {
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

  public removeTask(taskId: string): void {
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

  public getQueueSize(priority: number): number {
    const queue = this.queues.get(priority);
    return queue ? queue.length : 0;
  }

  public getTotalSize(): number {
    let total = 0;
    for (const queue of this.queues.values()) {
      total += queue.length;
    }
    return total;
  }

  public clear(): void {
    for (const queue of this.queues.values()) {
      queue.length = 0;
    }
    this.priorities.clear();
  }

  public setPriorityRange(min: number, max: number): void {
    this.minPriority = min;
    this.maxPriority = max;
    this.initializeQueues();
  }

  public getMinPriority(): number {
    return this.minPriority;
  }

  public getMaxPriority(): number {
    return this.maxPriority;
  }
}