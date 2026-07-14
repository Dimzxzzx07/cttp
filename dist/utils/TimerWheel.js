"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimerWheel = void 0;
class TimerWheel {
    constructor(tickDuration, ticks) {
        this.tickDuration = tickDuration || 1000;
        this.ticks = ticks || 60;
        this.wheels = new Map();
        this.timerId = null;
        this.initializeWheels();
        this.start();
    }
    initializeWheels() {
        for (let i = 0; i < this.ticks; i++) {
            this.wheels.set(i, new Map());
        }
    }
    start() {
        if (this.timerId) {
            return;
        }
        this.timerId = setInterval(() => {
            this.tick();
        }, this.tickDuration);
    }
    tick() {
        const currentTick = Math.floor(Date.now() / this.tickDuration) % this.ticks;
        const slot = this.wheels.get(currentTick);
        if (slot) {
            const now = Date.now();
            const expired = [];
            for (const [timestamp, callbacks] of slot) {
                if (timestamp <= now) {
                    for (const callback of callbacks) {
                        try {
                            callback();
                        }
                        catch (error) {
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
    schedule(callback, delay) {
        const executeAt = Date.now() + delay;
        const tick = Math.floor(executeAt / this.tickDuration) % this.ticks;
        const slot = this.wheels.get(tick);
        if (slot) {
            if (!slot.has(executeAt)) {
                slot.set(executeAt, []);
            }
            slot.get(executeAt).push(callback);
        }
    }
    clear() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
        this.wheels.clear();
        this.initializeWheels();
    }
    stop() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }
    restart() {
        this.stop();
        this.start();
    }
    getTickCount() {
        return this.ticks;
    }
    getTickDuration() {
        return this.tickDuration;
    }
    getActiveTimers() {
        let count = 0;
        for (const slot of this.wheels.values()) {
            count += slot.size;
        }
        return count;
    }
    getWheelSize() {
        return this.wheels.size;
    }
}
exports.TimerWheel = TimerWheel;
//# sourceMappingURL=TimerWheel.js.map