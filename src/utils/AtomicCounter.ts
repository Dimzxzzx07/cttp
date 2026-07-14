export class AtomicCounter {
  private value: number;

  constructor(initialValue?: number) {
    this.value = initialValue || 0;
  }

  public increment(): number {
    return ++this.value;
  }

  public decrement(): number {
    return --this.value;
  }

  public add(amount: number): number {
    this.value += amount;
    return this.value;
  }

  public subtract(amount: number): number {
    this.value -= amount;
    return this.value;
  }

  public get(): number {
    return this.value;
  }

  public set(value: number): void {
    this.value = value;
  }

  public reset(): void {
    this.value = 0;
  }

  public compareAndSet(expected: number, newValue: number): boolean {
    if (this.value === expected) {
      this.value = newValue;
      return true;
    }
    return false;
  }

  public getAndIncrement(): number {
    const old = this.value;
    this.value++;
    return old;
  }

  public getAndDecrement(): number {
    const old = this.value;
    this.value--;
    return old;
  }

  public incrementAndGet(): number {
    return ++this.value;
  }

  public decrementAndGet(): number {
    return --this.value;
  }

  public toString(): string {
    return String(this.value);
  }
}