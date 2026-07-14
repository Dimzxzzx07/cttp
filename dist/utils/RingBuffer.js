"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RingBuffer = void 0;
class RingBuffer {
    constructor(capacity) {
        this.capacity = capacity;
        this.buffer = new Array(capacity);
        this.head = 0;
        this.tail = 0;
        this.size = 0;
    }
    push(item) {
        if (this.isFull()) {
            this.pop();
        }
        this.buffer[this.tail] = item;
        this.tail = (this.tail + 1) % this.capacity;
        this.size++;
    }
    pop() {
        if (this.isEmpty()) {
            return undefined;
        }
        const item = this.buffer[this.head];
        this.buffer[this.head] = undefined;
        this.head = (this.head + 1) % this.capacity;
        this.size--;
        return item;
    }
    peek() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.buffer[this.head];
    }
    peekLast() {
        if (this.isEmpty()) {
            return undefined;
        }
        const index = (this.tail - 1 + this.capacity) % this.capacity;
        return this.buffer[index];
    }
    clear() {
        this.buffer = new Array(this.capacity);
        this.head = 0;
        this.tail = 0;
        this.size = 0;
    }
    isEmpty() {
        return this.size === 0;
    }
    isFull() {
        return this.size === this.capacity;
    }
    getSize() {
        return this.size;
    }
    getCapacity() {
        return this.capacity;
    }
    setCapacity(capacity) {
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
    toArray() {
        const result = [];
        for (let i = 0; i < this.size; i++) {
            result.push(this.buffer[(this.head + i) % this.capacity]);
        }
        return result;
    }
}
exports.RingBuffer = RingBuffer;
//# sourceMappingURL=RingBuffer.js.map