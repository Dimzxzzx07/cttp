export class CongestionControl {
  private cwnd: number;
  private ssthresh: number;
  private rtt: number;
  private rttVar: number;
  private rto: number;
  private lossCount: number;
  private mode: "slow-start" | "congestion-avoidance" | "fast-recovery";

  constructor() {
    this.cwnd = 10;
    this.ssthresh = 65535;
    this.rtt = 100;
    this.rttVar = 50;
    this.rto = 300;
    this.lossCount = 0;
    this.mode = "slow-start";
  }

  public onPacketAcked(): void {
    if (this.mode === "slow-start") {
      this.cwnd += 1;
      if (this.cwnd >= this.ssthresh) {
        this.mode = "congestion-avoidance";
      }
    } else if (this.mode === "congestion-avoidance") {
      this.cwnd += 1 / this.cwnd;
    }
  }

  public onPacketLost(): void {
    this.lossCount++;
    this.ssthresh = Math.max(this.cwnd / 2, 2);
    this.cwnd = this.ssthresh;
    this.mode = "fast-recovery";
    this.rto = Math.max(this.rto * 2, 1000);
  }

  public onTimeout(): void {
    this.ssthresh = Math.max(this.cwnd / 2, 2);
    this.cwnd = 1;
    this.mode = "slow-start";
    this.rto = Math.max(this.rto * 2, 1000);
  }

  public updateRTT(sampleRTT: number): void {
    const rttVar = this.rttVar * 0.75 + Math.abs(sampleRTT - this.rtt) * 0.25;
    this.rttVar = Math.max(rttVar, 10);
    this.rtt = this.rtt * 0.875 + sampleRTT * 0.125;
    this.rto = this.rtt + 4 * this.rttVar;
    this.rto = Math.max(this.rto, 200);
  }

  public getCWND(): number {
    return this.cwnd;
  }

  public getSsthresh(): number {
    return this.ssthresh;
  }

  public getRTO(): number {
    return this.rto;
  }

  public getMode(): string {
    return this.mode;
  }

  public getLossCount(): number {
    return this.lossCount;
  }

  public isCongested(): boolean {
    return this.mode === "fast-recovery" || this.cwnd < this.ssthresh / 2;
  }

  public getSlowStartThreshold(): number {
    return this.ssthresh;
  }

  public setSlowStartThreshold(threshold: number): void {
    this.ssthresh = Math.max(threshold, 2);
  }

  public getCongestionWindow(): number {
    return this.cwnd;
  }

  public setCongestionWindow(cwnd: number): void {
    this.cwnd = Math.max(cwnd, 1);
  }

  public reset(): void {
    this.cwnd = 10;
    this.ssthresh = 65535;
    this.rtt = 100;
    this.rttVar = 50;
    this.rto = 300;
    this.lossCount = 0;
    this.mode = "slow-start";
  }

  public getRTT(): number {
    return this.rtt;
  }

  public getRTTVar(): number {
    return this.rttVar;
  }
}