"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchiveHandler = void 0;
class ArchiveHandler {
    constructor() {
        this.archives = new Map();
        this.compressionLevel = 6;
    }
    async archive(data, options) {
        const archiveId = this.generateArchiveId();
        const format = options?.format || "gzip";
        const compression = options?.compression || this.compressionLevel;
        let archiveData;
        if (Buffer.isBuffer(data)) {
            archiveData = data;
        }
        else if (typeof data === "string") {
            archiveData = Buffer.from(data, "utf8");
        }
        else {
            archiveData = Buffer.from(JSON.stringify(data), "utf8");
        }
        const compressed = await this.compress(archiveData, format, compression);
        const metadata = {
            id: archiveId,
            originalSize: archiveData.length,
            compressedSize: compressed.length,
            format,
            compression,
            timestamp: Date.now(),
            options
        };
        this.archives.set(archiveId, {
            data: compressed,
            metadata
        });
        return {
            archiveId,
            data: compressed,
            metadata
        };
    }
    async extract(archiveId) {
        const archive = this.archives.get(archiveId);
        if (!archive) {
            throw new Error(`Archive ${archiveId} not found`);
        }
        const decompressed = await this.decompress(archive.data, archive.metadata.format);
        const result = {
            data: decompressed,
            metadata: archive.metadata
        };
        return result;
    }
    async compress(data, format, level) {
        const zlib = require("zlib");
        switch (format) {
            case "gzip":
                return zlib.gzipSync(data, { level });
            case "deflate":
                return zlib.deflateSync(data, { level });
            case "brotli":
                return zlib.brotliCompressSync(data, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: level } });
            case "zip":
                return this.createZip(data);
            case "tar":
                return this.createTar(data);
            default:
                return data;
        }
    }
    async decompress(data, format) {
        const zlib = require("zlib");
        switch (format) {
            case "gzip":
                return zlib.gunzipSync(data);
            case "deflate":
                return zlib.inflateSync(data);
            case "brotli":
                return zlib.brotliDecompressSync(data);
            case "zip":
                return this.extractZip(data);
            case "tar":
                return this.extractTar(data);
            default:
                return data;
        }
    }
    createZip(data) {
        const { ZipFile } = require("zip");
        const zip = new ZipFile();
        zip.add("file", data);
        return zip.toBuffer();
    }
    createTar(data) {
        const tar = require("tar");
        return tar.create({}, [{ path: "file", data }]);
    }
    extractZip(data) {
        const { ZipFile } = require("zip");
        const zip = new ZipFile(data);
        const files = zip.getFiles();
        if (files.length > 0) {
            return zip.getData(files[0]);
        }
        return Buffer.alloc(0);
    }
    extractTar(data) {
        const tar = require("tar");
        const entries = [];
        tar.extract({ onentry: (entry) => entries.push(entry) }, data);
        if (entries.length > 0) {
            return entries[0].data;
        }
        return Buffer.alloc(0);
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
    setCompressionLevel(level) {
        this.compressionLevel = Math.max(1, Math.min(9, level));
    }
    getCompressionLevel() {
        return this.compressionLevel;
    }
    getSize(archiveId) {
        const archive = this.archives.get(archiveId);
        return archive ? archive.metadata.compressedSize : 0;
    }
    getOriginalSize(archiveId) {
        const archive = this.archives.get(archiveId);
        return archive ? archive.metadata.originalSize : 0;
    }
}
exports.ArchiveHandler = ArchiveHandler;
//# sourceMappingURL=ArchiveHandler.js.map