export class EventEmitter {
  private events: Map<string, Function[]>;
  private onceEvents: Map<string, Function[]>;
  private maxListeners: number;

  constructor(maxListeners: number = 10) {
    this.events = new Map();
    this.onceEvents = new Map();
    this.maxListeners = maxListeners;
  }

  public on(event: string, listener: Function): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    const listeners = this.events.get(event)!;
    if (listeners.length < this.maxListeners) {
      listeners.push(listener);
    }
  }

  public once(event: string, listener: Function): void {
    if (!this.onceEvents.has(event)) {
      this.onceEvents.set(event, []);
    }
    const listeners = this.onceEvents.get(event)!;
    if (listeners.length < this.maxListeners) {
      listeners.push(listener);
    }
  }

  public off(event: string, listener: Function): void {
    const events = this.events.get(event);
    if (events) {
      const index = events.indexOf(listener);
      if (index > -1) {
        events.splice(index, 1);
      }
    }
    const onceEvents = this.onceEvents.get(event);
    if (onceEvents) {
      const index = onceEvents.indexOf(listener);
      if (index > -1) {
        onceEvents.splice(index, 1);
      }
    }
  }

  public emit(event: string, ...args: any[]): void {
    const events = this.events.get(event) || [];
    for (const listener of events) {
      listener(...args);
    }
    const onceEvents = this.onceEvents.get(event) || [];
    for (const listener of onceEvents) {
      listener(...args);
    }
    this.onceEvents.delete(event);
  }

  public removeAllListeners(event?: string): void {
    if (event) {
      this.events.delete(event);
      this.onceEvents.delete(event);
    } else {
      this.events.clear();
      this.onceEvents.clear();
    }
  }

  public listenerCount(event: string): number {
    const events = this.events.get(event) || [];
    const onceEvents = this.onceEvents.get(event) || [];
    return events.length + onceEvents.length;
  }

  public getMaxListeners(): number {
    return this.maxListeners;
  }

  public setMaxListeners(max: number): void {
    this.maxListeners = max;
  }

  public eventNames(): string[] {
    const names = new Set([
      ...this.events.keys(),
      ...this.onceEvents.keys()
    ]);
    return Array.from(names);
  }
}