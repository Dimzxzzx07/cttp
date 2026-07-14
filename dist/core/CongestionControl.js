"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CongestionControl = void 0;
class CongestionControl {
    constructor() {
        this.cwnd = 10;
        this.ssthresh = 65535;
        this.rtt = 100;
        this.rttVar = 50;
        this.rto = 300;
        this.lossCount = 0;
        this.mode = "slow-start";
    }
    onPacketAcked() {
        if (this.mode === "slow-start") {
            this.cwnd += 1;
            if (this.cwnd >= this.ssthresh) {
                this.mode = "congestion-avoidance";
            }
        }
        else if (this.mode === "congestion-avoidance") {
            this.cwnd += 1 / this.cwnd;
        }
    }
    onPacketLost() {
        this.lossCount++;
        this.ssthresh = Math.max(this.cwnd / 2, 2);
        this.cwnd = this.ssthresh;
        this.mode = "fast-recovery";
        this.rto = Math.max(this.rto * 2, 1000);
    }
    onTimeout() {
        this.ssthresh = Math.max(this.cwnd / 2, 2);
        this.cwnd = 1;
        this.mode = "slow-start";
        this.rto = Math.max(this.rto * 2, 1000);
    }
    updateRTT(sampleRTT) {
        const rttVar = this.rttVar * 0.75 + Math.abs(sampleRTT - this.rtt) * 0.25;
        this.rttVar = Math.max(rttVar, 10);
        this.rtt = this.rtt * 0.875 + sampleRTT * 0.125;
        this.rto = this.rtt + 4 * this.rttVar;
        this.rto = Math.max(this.rto, 200);
    }
    getCWND() {
        return this.cwnd;
    }
    getSsthresh() {
        return this.ssthresh;
    }
    getRTO() {
        return this.rto;
    }
    getMode() {
        return this.mode;
    }
    getLossCount() {
        return this.lossCount;
    }
    isCongested() {
        return this.mode === "fast-recovery" || this.cwnd < this.ssthresh / 2;
    }
    getSlowStartThreshold() {
        return this.ssthresh;
    }
    setSlowStartThreshold(threshold) {
        this.ssthresh = Math.max(threshold, 2);
    }
    getCongestionWindow() {
        return this.cwnd;
    }
    setCongestionWindow(cwnd) {
        this.cwnd = Math.max(cwnd, 1);
    }
    reset() {
        this.cwnd = 10;
        this.ssthresh = 65535;
        this.rtt = 100;
        this.rttVar = 50;
        this.rto = 300;
        this.lossCount = 0;
        this.mode = "slow-start";
    }
    getRTT() {
        return this.rtt;
    }
    getRTTVar() {
        return this.rttVar;
    }
}
exports.CongestionControl = CongestionControl;
//# sourceMappingURL=CongestionControl.js.map