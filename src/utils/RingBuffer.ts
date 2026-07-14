export class RingBuffer<T> {
  private buffer: T[];
  private capacity: number;
  private head: number;
  private tail: number;
  private size: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.buffer = new Array(capacity);
    this.head = 0;
    this.tail = 0;
    this.size = 0;
  }

  public push(item: T): void {
    if (this.isFull()) {
      this.pop();
    }
    this.buffer[this.tail] = item;
    this.tail = (this.tail + 1) % this.capacity;
    this.size++;
  }

  public pop(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    const item = this.buffer[this.head];
    this.buffer[this.head] = undefined as any;
    this.head = (this.head + 1) % this.capacity;
    this.size--;
    return item;
  }

  public peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.buffer[this.head];
  }

  public peekLast(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    const index = (this.tail - 1 + this.capacity) % this.capacity;
    return this.buffer[index];
  }

  public clear(): void {
    this.buffer = new Array(this.capacity);
    this.head = 0;
    this.tail = 0;
    this.size = 0;
  }

  public isEmpty(): boolean {
    return this.size === 0;
  }

  public isFull(): boolean {
    return this.size === this.capacity;
  }

  public getSize(): number {
    return this.size;
  }

  public getCapacity(): number {
    return this.capacity;
  }

  public setCapacity(capacity: number): void {
    if (capacity < this.size) {
      throw new Error("New capacity must be >= current size");
    }
    const newBuffer = new Array(capacity);
    for (let i = 0; i < this.size; i++) {
      newBuffer[i] = this.buffer[(this.head + i) % this.capacity];
    }
    this.buffer = newBuffer;
    this.capacity = capacity;
    this.head = 0;
    this.tail = this.size;
  }

  public toArray(): T[] {
    const result: T[] = [];
    for (let i = 0; i < this.size; i++) {
      result.push(this.buffer[(this.head + i) % this.capacity]);
    }
    return result;
  }
}