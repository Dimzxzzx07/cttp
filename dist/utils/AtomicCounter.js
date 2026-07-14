"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtomicCounter = void 0;
class AtomicCounter {
    constructor(initialValue) {
        this.value = initialValue || 0;
    }
    increment() {
        return ++this.value;
    }
    decrement() {
        return --this.value;
    }
    add(amount) {
        this.value += amount;
        return this.value;
    }
    subtract(amount) {
        this.value -= amount;
        return this.value;
    }
    get() {
        return this.value;
    }
    set(value) {
        this.value = value;
    }
    reset() {
        this.value = 0;
    }
    compareAndSet(expected, newValue) {
        if (this.value === expected) {
            this.value = newValue;
            return true;
        }
        return false;
    }
    getAndIncrement() {
        const old = this.value;
        this.value++;
        return old;
    }
    getAndDecrement() {
        const old = this.value;
        this.value--;
        return old;
    }
    incrementAndGet() {
        return ++this.value;
    }
    decrementAndGet() {
        return --this.value;
    }
    toString() {
        return String(this.value);
    }
}
exports.AtomicCounter = AtomicCounter;
//# sourceMappingURL=AtomicCounter.js.map