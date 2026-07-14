export class ArchiveHandler {
  private archives: Map<string, any>;
  private compressionLevel: number;

  constructor() {
    this.archives = new Map();
    this.compressionLevel = 6;
  }

  public async archive(data: any, options?: any): Promise<any> {
    const archiveId = this.generateArchiveId();
    const format = options?.format || "gzip";
    const compression = options?.compression || this.compressionLevel;

    let archiveData: Buffer;
    if (Buffer.isBuffer(data)) {
      archiveData = data;
    } else if (typeof data === "string") {
      archiveData = Buffer.from(data, "utf8");
    } else {
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

  public async extract(archiveId: string): Promise<any> {
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

  private async compress(data: Buffer, format: string, level: number): Promise<Buffer> {
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

  private async decompress(data: Buffer, format: string): Promise<Buffer> {
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

  private createZip(data: Buffer): Buffer {
    const { ZipFile } = require("zip");
    const zip = new ZipFile();
    zip.add("file", data);
    return zip.toBuffer();
  }

  private createTar(data: Buffer): Buffer {
    const tar = require("tar");
    return tar.create({}, [{ path: "file", data }]);
  }

  private extractZip(data: Buffer): Buffer {
    const { ZipFile } = require("zip");
    const zip = new ZipFile(data);
    const files = zip.getFiles();
    if (files.length > 0) {
      return zip.getData(files[0]);
    }
    return Buffer.alloc(0);
  }

  private extractTar(data: Buffer): Buffer {
    const tar = require("tar");
    const entries: any[] = [];
    tar.extract({ onentry: (entry: any) => entries.push(entry) }, data);
    if (entries.length > 0) {
      return entries[0].data;
    }
    return Buffer.alloc(0);
  }

  private generateArchiveId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  public getArchive(archiveId: string): any {
    return this.archives.get(archiveId);
  }

  public getArchives(): string[] {
    return Array.from(this.archives.keys());
  }

  public deleteArchive(archiveId: string): void {
    this.archives.delete(archiveId);
  }

  public clear(): void {
    this.archives.clear();
  }

  public setCompressionLevel(level: number): void {
    this.compressionLevel = Math.max(1, Math.min(9, level));
  }

  public getCompressionLevel(): number {
    return this.compressionLevel;
  }

  public getSize(archiveId: string): number {
    const archive = this.archives.get(archiveId);
    return archive ? archive.metadata.compressedSize : 0;
  }

  public getOriginalSize(archiveId: string): number {
    const archive = this.archives.get(archiveId);
    return archive ? archive.metadata.originalSize : 0;
  }
}