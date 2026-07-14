export class TaskScheduler {
  private tasks: Map<string, any>;
  private running: Map<string, boolean>;
  private maxConcurrent: number;
  private activeCount: number;
  private queue: any[];
  private isProcessing: boolean;

  constructor() {
    this.tasks = new Map();
    this.running = new Map();
    this.maxConcurrent = 10;
    this.activeCount = 0;
    this.queue = [];
    this.isProcessing = false;
  }

  public schedule(task: any, priority: number = 0): string {
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

  public async execute(taskId: string): Promise<any> {
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
    } catch (error) {
      scheduled.status = "failed";
      scheduled.error = error;
      throw error;
    } finally {
      this.running.set(taskId, false);
      this.activeCount--;
      this.processQueue();
    }
  }

  private processQueue(): void {
    if (this.isProcessing) return;
    this.isProcessing = true;
    while (this.activeCount < this.maxConcurrent && this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        this.activeCount++;
        this.execute(task.id).catch(() => {});
      }
    }
    this.isProcessing = false;
  }

  private sortQueue(): void {
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  private generateTaskId(): string {
    return Date.now() + "-" + Math.random().toString(36).substring(2, 15);
  }

  public cancel(taskId: string): void {
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

  public getTask(taskId: string): any {
    return this.tasks.get(taskId);
  }

  public getTasks(): any[] {
    return Array.from(this.tasks.values());
  }

  public getPendingTasks(): any[] {
    return Array.from(this.tasks.values()).filter(t => t.status === "pending");
  }

  public getRunningTasks(): any[] {
    return Array.from(this.tasks.values()).filter(t => t.status === "running");
  }

  public getCompletedTasks(): any[] {
    return Array.from(this.tasks.values()).filter(t => t.status === "completed");
  }

  public getFailedTasks(): any[] {
    return Array.from(this.tasks.values()).filter(t => t.status === "failed");
  }

  public clear(): void {
    this.tasks.clear();
    this.running.clear();
    this.queue = [];
    this.activeCount = 0;
  }

  public setMaxConcurrent(max: number): void {
    this.maxConcurrent = Math.max(1, max);
  }
}
