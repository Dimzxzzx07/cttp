export class TimerWheel {
  private wheels: Map<number, Map<number, Function[]>>;
  private ticks: number;
  private tickDuration: number;
  private timerId: NodeJS.Timeout | null;

  constructor(tickDuration?: number, ticks?: number) {
    this.tickDuration = tickDuration || 1000;
    this.ticks = ticks || 60;
    this.wheels = new Map();
    this.timerId = null;
    this.initializeWheels();
    this.start();
  }

  private initializeWheels(): void {
    for (let i = 0; i < this.ticks; i++) {
      this.wheels.set(i, new Map());
    }
  }

  private start(): void {
    if (this.timerId) {
      return;
    }

    this.timerId = setInterval(() => {
      this.tick();
    }, this.tickDuration);
  }

  private tick(): void {
    const currentTick = Math.floor(Date.now() / this.tickDuration) % this.ticks;
    const slot = this.wheels.get(currentTick);
    if (slot) {
      const now = Date.now();
      const expired: number[] = [];
      for (const [timestamp, callbacks] of slot) {
        if (timestamp <= now) {
          for (const callback of callbacks) {
            try {
              callback();
            } catch (error) {
              console.error("Timer callback error:", error);
            }
          }
          expired.push(timestamp);
        }
      }
      for (const timestamp of expired) {
        slot.delete(timestamp);
      }
    }
  }

  public schedule(callback: Function, delay: number): void {
    const executeAt = Date.now() + delay;
    const tick = Math.floor(executeAt / this.tickDuration) % this.ticks;
    const slot = this.wheels.get(tick);
    if (slot) {
      if (!slot.has(executeAt)) {
        slot.set(executeAt, []);
      }
      slot.get(executeAt)!.push(callback);
    }
  }

  public clear(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.wheels.clear();
    this.initializeWheels();
  }

  public stop(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public restart(): void {
    this.stop();
    this.start();
  }

  public getTickCount(): number {
    return this.ticks;
  }

  public getTickDuration(): number {
    return this.tickDuration;
  }

  public getActiveTimers(): number {
    let count = 0;
    for (const slot of this.wheels.values()) {
      count += slot.size;
    }
    return count;
  }

  public getWheelSize(): number {
    return this.wheels.size;
  }
}