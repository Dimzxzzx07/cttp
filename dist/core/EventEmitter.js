"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitter = void 0;
class EventEmitter {
    constructor(maxListeners = 10) {
        this.events = new Map();
        this.onceEvents = new Map();
        this.maxListeners = maxListeners;
    }
    on(event, listener) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        const listeners = this.events.get(event);
        if (listeners.length < this.maxListeners) {
            listeners.push(listener);
        }
    }
    once(event, listener) {
        if (!this.onceEvents.has(event)) {
            this.onceEvents.set(event, []);
        }
        const listeners = this.onceEvents.get(event);
        if (listeners.length < this.maxListeners) {
            listeners.push(listener);
        }
    }
    off(event, listener) {
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
    emit(event, ...args) {
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
    removeAllListeners(event) {
        if (event) {
            this.events.delete(event);
            this.onceEvents.delete(event);
        }
        else {
            this.events.clear();
            this.onceEvents.clear();
        }
    }
    listenerCount(event) {
        const events = this.events.get(event) || [];
        const onceEvents = this.onceEvents.get(event) || [];
        return events.length + onceEvents.length;
    }
    getMaxListeners() {
        return this.maxListeners;
    }
    setMaxListeners(max) {
        this.maxListeners = max;
    }
    eventNames() {
        const names = new Set([
            ...this.events.keys(),
            ...this.onceEvents.keys()
        ]);
        return Array.from(names);
    }
}
exports.EventEmitter = EventEmitter;
//# sourceMappingURL=EventEmitter.js.map