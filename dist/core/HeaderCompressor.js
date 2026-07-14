"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderCompressor = void 0;
const Constants_1 = require("./Constants");
const BufferUtils_1 = require("../utils/BufferUtils");
class HeaderCompressor {
    constructor() {
        this.constants = new Constants_1.Constants();
        this.bufferUtils = new BufferUtils_1.BufferUtils();
        this.compressionLevel = 6;
        this.dictionary = new Map();
        this.initializeDictionary();
    }
    initializeDictionary() {
        const commonHeaders = [
            "host", "user-agent", "accept", "accept-encoding",
            "accept-language", "content-type", "content-length",
            "cache-control", "authorization", "cookie", "referer",
            "origin", "connection", "upgrade", "etag", "if-match",
            "if-none-match", "range", "x-request-id", "x-forwarded-for"
        ];
        for (const header of commonHeaders) {
            this.dictionary.set(header, this.hashHeader(header));
        }
    }
    hashHeader(header) {
        let hash = 0;
        for (let i = 0; i < header.length; i++) {
            hash = (hash << 5) - hash + header.charCodeAt(i);
            hash = hash & hash;
        }
        return hash.toString(16);
    }
    compress(headers) {
        const result = [];
        const compressed = new Map();
        for (const [key, value] of headers) {
            const keyHash = this.dictionary.get(key);
            if (keyHash) {
                const encoded = this.encodeHeader(keyHash, value);
                compressed.set(keyHash, encoded);
            }
            else {
                const hash = this.hashHeader(key);
                this.dictionary.set(key, hash);
                const encoded = this.encodeHeader(hash, value);
                compressed.set(hash, encoded);
            }
        }
        const jsonString = JSON.stringify(Object.fromEntries(compressed));
        const buffer = Buffer.from(jsonString, "utf8");
        const compressedBuffer = this.compressBuffer(buffer);
        return compressedBuffer;
    }
    decompress(data) {
        const decompressed = this.decompressBuffer(data);
        const jsonString = decompressed.toString("utf8");
        const parsed = JSON.parse(jsonString);
        const headers = new Map();
        for (const [keyHash, value] of Object.entries(parsed)) {
            const key = this.findKeyByHash(keyHash);
            if (key) {
                const decoded = this.decodeHeader(value);
                headers.set(key, decoded);
            }
        }
        return headers;
    }
    encodeHeader(hash, value) {
        const encoded = Buffer.from(value, "utf8");
        const compressed = this.compressBuffer(encoded);
        return Buffer.concat([
            Buffer.from(hash, "hex"),
            Buffer.from([compressed.length]),
            compressed
        ]).toString("base64");
    }
    decodeHeader(encoded) {
        const buffer = Buffer.from(encoded, "base64");
        const length = buffer[32];
        const compressed = buffer.subarray(33, 33 + length);
        const decompressed = this.decompressBuffer(compressed);
        return decompressed.toString("utf8");
    }
    compressBuffer(data) {
        const zlib = require("zlib");
        return zlib.deflateSync(data, { level: this.compressionLevel });
    }
    decompressBuffer(data) {
        const zlib = require("zlib");
        return zlib.inflateSync(data);
    }
    findKeyByHash(hash) {
        for (const [key, value] of this.dictionary) {
            if (value === hash) {
                return key;
            }
        }
        return undefined;
    }
    setCompressionLevel(level) {
        this.compressionLevel = Math.max(1, Math.min(9, level));
    }
    getCompressionLevel() {
        return this.compressionLevel;
    }
    getDictionarySize() {
        return this.dictionary.size;
    }
    addToDictionary(key) {
        if (!this.dictionary.has(key)) {
            this.dictionary.set(key, this.hashHeader(key));
        }
    }
    removeFromDictionary(key) {
        this.dictionary.delete(key);
    }
}
exports.HeaderCompressor = HeaderCompressor;
//# sourceMappingURL=HeaderCompressor.js.map