"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloomFilter = void 0;
class BloomFilter {
    constructor(size, hashCount) {
        this.size = size;
        this.hashCount = hashCount;
        this.bits = new Uint8Array(size);
    }
    add(value) {
        const hashes = this.getHashes(value);
        for (const hash of hashes) {
            const index = hash % this.size;
            this.bits[index] = 1;
        }
    }
    contains(value) {
        const hashes = this.getHashes(value);
        for (const hash of hashes) {
            const index = hash % this.size;
            if (this.bits[index] === 0) {
                return false;
            }
        }
        return true;
    }
    getHashes(value) {
        const hashes = [];
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
    clear() {
        this.bits = new Uint8Array(this.size);
    }
    getSize() {
        return this.size;
    }
    getHashCount() {
        return this.hashCount;
    }
    getBits() {
        return this.bits;
    }
    getPopulation() {
        let count = 0;
        for (let i = 0; i < this.size; i++) {
            if (this.bits[i] === 1) {
                count++;
            }
        }
        return count;
    }
    getFalsePositiveRate() {
        const population = this.getPopulation();
        const p = population / this.size;
        return Math.pow(p, this.hashCount);
    }
}
exports.BloomFilter = BloomFilter;
//# sourceMappingURL=BloomFilter.js.map