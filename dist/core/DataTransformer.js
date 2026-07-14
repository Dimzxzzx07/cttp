"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTransformer = void 0;
class DataTransformer {
    constructor() {
        this.transformers = new Map();
        this.reverseTransformers = new Map();
        this.registerDefaultTransformers();
    }
    registerDefaultTransformers() {
        this.register("json", (data) => {
            if (typeof data === "string") {
                return JSON.parse(data);
            }
            return JSON.stringify(data);
        });
        this.register("base64", (data) => {
            if (typeof data === "string") {
                return Buffer.from(data, "base64");
            }
            return data.toString("base64");
        });
        this.register("hex", (data) => {
            if (typeof data === "string") {
                return Buffer.from(data, "hex");
            }
            return data.toString("hex");
        });
        this.register("utf8", (data) => {
            if (typeof data === "string") {
                return Buffer.from(data, "utf8");
            }
            return data.toString("utf8");
        });
        this.register("gzip", (data) => {
            const zlib = require("zlib");
            if (Buffer.isBuffer(data)) {
                return zlib.gzipSync(data);
            }
            return zlib.gunzipSync(data);
        });
        this.register("deflate", (data) => {
            const zlib = require("zlib");
            if (Buffer.isBuffer(data)) {
                return zlib.deflateSync(data);
            }
            return zlib.inflateSync(data);
        });
        this.register("brotli", (data) => {
            const zlib = require("zlib");
            if (Buffer.isBuffer(data)) {
                return zlib.brotliCompressSync(data);
            }
            return zlib.brotliDecompressSync(data);
        });
    }
    register(name, transformer, reverse) {
        this.transformers.set(name, transformer);
        if (reverse) {
            this.reverseTransformers.set(name, reverse);
        }
    }
    transform(data, type) {
        const transformer = this.transformers.get(type);
        if (!transformer) {
            throw new Error(`Transformer ${type} not found`);
        }
        return transformer(data);
    }
    reverse(data, type) {
        const transformer = this.reverseTransformers.get(type);
        if (!transformer) {
            throw new Error(`Reverse transformer ${type} not found`);
        }
        return transformer(data);
    }
    hasTransformer(type) {
        return this.transformers.has(type);
    }
    hasReverseTransformer(type) {
        return this.reverseTransformers.has(type);
    }
    getTransformerNames() {
        return Array.from(this.transformers.keys());
    }
    removeTransformer(type) {
        this.transformers.delete(type);
        this.reverseTransformers.delete(type);
    }
    clear() {
        this.transformers.clear();
        this.reverseTransformers.clear();
    }
}
exports.DataTransformer = DataTransformer;
//# sourceMappingURL=DataTransformer.js.map