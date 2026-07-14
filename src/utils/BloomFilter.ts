export class BloomFilter {
  private bits: Uint8Array;
  private size: number;
  private hashCount: number;

  constructor(size: number, hashCount: number) {
    this.size = size;
    this.hashCount = hashCount;
    this.bits = new Uint8Array(size);
  }

  public add(value: string): void {
    const hashes = this.getHashes(value);
    for (const hash of hashes) {
      const index = hash % this.size;
      this.bits[index] = 1;
    }
  }

  public contains(value: string): boolean {
    const hashes = this.getHashes(value);
    for (const hash of hashes) {
      const index = hash % this.size;
      if (this.bits[index] === 0) {
        return false;
      }
    }
    return true;
  }

  private getHashes(value: string): number[] {
    const hashes: number[] = [];
    const crypto = require("crypto");
    const bytes = Buffer.from(value, "utf8");

    for (let i = 0; i < this.hashCount; i++) {
      const hash = crypto.createHash("sha256");
      hash.update(bytes);
      hash.update(Buffer.from([i]));
      const digest = hash.digest();
      const number = digest.readUInt32BE(0);
      hashes.push(number);
    }

    return hashes;
  }

  public clear(): void {
    this.bits = new Uint8Array(this.size);
  }

  public getSize(): number {
    return this.size;
  }

  public getHashCount(): number {
    return this.hashCount;
  }

  public getBits(): Uint8Array {
    return this.bits;
  }

  public getPopulation(): number {
    let count = 0;
    for (let i = 0; i < this.size; i++) {
      if (this.bits[i] === 1) {
        count++;
      }
    }
    return count;
  }

  public getFalsePositiveRate(): number {
    const population = this.getPopulation();
    const p = population / this.size;
    return Math.pow(p, this.hashCount);
  }
}