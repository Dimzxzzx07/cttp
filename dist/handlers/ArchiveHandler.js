"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchiveHandler = void 0;
const CTTPResponse_1 = require("../core/CTTPResponse");
const HTTPVersion_1 = require("../core/HTTPVersion");
class ArchiveHandler {
    constructor() {
        this.archives = new Map();
    }
    async handle(request) {
        const body = request.getBody();
        const action = body?.action || "compress";
        const data = body?.data;
        const target = body?.target;
        const options = body?.options || {};
        if (!data) {
            return new CTTPResponse_1.CTTPResponse(400, "Bad Request", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), { error: "Missing data" });
        }
        try {
            let result;
            switch (action) {
                case "compress":
                    result = await this.compress(data, options);
                    break;
                case "move":
                    result = await this.move(data, target, options);
                    break;
                case "restore":
                    result = await this.restore(data, options);
                    break;
                default:
                    return new CTTPResponse_1.CTTPResponse(400, "Bad Request", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), { error: `Unknown action: ${action}` });
            }
            return new CTTPResponse_1.CTTPResponse(200, "OK", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), result);
        }
        catch (error) {
            return new CTTPResponse_1.CTTPResponse(500, "Internal Server Error", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), { error: "Archive operation failed", details: error.message });
        }
    }
    async compress(data, options) {
        const archiveId = this.generateArchiveId();
        const format = options.format || "gzip";
        const level = options.level || 6;
        let buffer;
        if (Buffer.isBuffer(data)) {
            buffer = data;
        }
        else if (typeof data === "string") {
            buffer = Buffer.from(data, "utf8");
        }
        else {
            buffer = Buffer.from(JSON.stringify(data), "utf8");
        }
        const compressed = await this.compressData(buffer, format, level);
        const archive = {
            id: archiveId,
            data: compressed,
            metadata: {
                format,
                level,
                originalSize: buffer.length,
                compressedSize: compressed.length,
                timestamp: Date.now(),
                originalType: typeof data
            }
        };
        this.archives.set(archiveId, archive);
        return {
            archiveId,
            status: "compressed",
            location: `/archive/${archiveId}`,
            size: compressed.length,
            archivedAt: new Date().toISOString()
        };
    }
    async move(data, target, options) {
        const archiveId = this.generateArchiveId();
        const location = target || `/cold-storage/${archiveId}`;
        let buffer;
        if (Buffer.isBuffer(data)) {
            buffer = data;
        }
        else if (typeof data === "string") {
            buffer = Buffer.from(data, "utf8");
        }
        else {
            buffer = Buffer.from(JSON.stringify(data), "utf8");
        }
        const archive = {
            id: archiveId,
            data: buffer,
            metadata: {
                location,
                timestamp: Date.now(),
                originalType: typeof data,
                moved: true
            }
        };
        this.archives.set(archiveId, archive);
        return {
            archiveId,
            status: "moved",
            location,
            size: buffer.length,
            archivedAt: new Date().toISOString()
        };
    }
    async restore(data, options) {
        const archiveId = typeof data === "string" ? data : data.archiveId;
        const archive = this.archives.get(archiveId);
        if (!archive) {
            throw new Error(`Archive ${archiveId} not found`);
        }
        let restored;
        if (archive.metadata.format && archive.metadata.format !== "none") {
            restored = await this.decompressData(archive.data, archive.metadata.format);
        }
        else {
            restored = archive.data;
        }
        if (archive.metadata.originalType === "string") {
            restored = restored.toString("utf8");
        }
        else if (archive.metadata.originalType === "object") {
            restored = JSON.parse(restored.toString("utf8"));
        }
        this.archives.delete(archiveId);
        return {
            archiveId,
            status: "restored",
            location: options.target || "/restored",
            size: restored.length || Buffer.byteLength(JSON.stringify(restored)),
            archivedAt: new Date().toISOString()
        };
    }
    async compressData(data, format, level) {
        const zlib = require("zlib");
        switch (format) {
            case "gzip":
                return zlib.gzipSync(data, { level });
            case "deflate":
                return zlib.deflateSync(data, { level });
            case "brotli":
                return zlib.brotliCompressSync(data);
            case "zlib":
                return zlib.deflateRawSync(data, { level });
            default:
                return data;
        }
    }
    async decompressData(data, format) {
        const zlib = require("zlib");
        switch (format) {
            case "gzip":
                return zlib.gunzipSync(data);
            case "deflate":
                return zlib.inflateSync(data);
            case "brotli":
                return zlib.brotliDecompressSync(data);
            case "zlib":
                return zlib.inflateRawSync(data);
            default:
                return data;
        }
    }
    generateArchiveId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
    getArchive(archiveId) {
        return this.archives.get(archiveId);
    }
    getArchives() {
        return Array.from(this.archives.keys());
    }
    deleteArchive(archiveId) {
        this.archives.delete(archiveId);
    }
    clear() {
        this.archives.clear();
    }
}
exports.ArchiveHandler = ArchiveHandler;
//# sourceMappingURL=ArchiveHandler.js.map