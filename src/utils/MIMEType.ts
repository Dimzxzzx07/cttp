export class MIMEType {
  private type: string;
  private subtype: string;
  private parameters: Map<string, string>;

  constructor(type: string) {
    const parts = type.split(";");
    const mainParts = parts[0].trim().split("/");
    this.type = mainParts[0] || "application";
    this.subtype = mainParts[1] || "octet-stream";
    this.parameters = new Map();

    for (let i = 1; i < parts.length; i++) {
      const param = parts[i].trim();
      const [key, value] = param.split("=");
      if (key && value) {
        this.parameters.set(key.trim(), value.trim());
      }
    }
  }

  public getType(): string {
    return this.type;
  }

  public getSubtype(): string {
    return this.subtype;
  }

  public getParameters(): Map<string, string> {
    return new Map(this.parameters);
  }

  public getParameter(key: string): string | undefined {
    return this.parameters.get(key);
  }

  public setParameter(key: string, value: string): void {
    this.parameters.set(key, value);
  }

  public removeParameter(key: string): void {
    this.parameters.delete(key);
  }

  public toString(): string {
    let result = `${this.type}/${this.subtype}`;
    for (const [key, value] of this.parameters) {
      result += `; ${key}=${value}`;
    }
    return result;
  }

  public isType(type: string): boolean {
    return this.type === type;
  }

  public isSubtype(subtype: string): boolean {
    return this.subtype === subtype;
  }

  public match(pattern: string): boolean {
    const [type, subtype] = pattern.split("/");
    if (type && type !== "*" && this.type !== type) {
      return false;
    }
    if (subtype && subtype !== "*" && this.subtype !== subtype) {
      return false;
    }
    return true;
  }

  public static fromExtension(extension: string): string {
    const map: Record<string, string> = {
      "txt": "text/plain",
      "html": "text/html",
      "htm": "text/html",
      "css": "text/css",
      "js": "application/javascript",
      "json": "application/json",
      "xml": "application/xml",
      "png": "image/png",
      "jpg": "image/jpeg",
      "jpeg": "image/jpeg",
      "gif": "image/gif",
      "webp": "image/webp",
      "svg": "image/svg+xml",
      "pdf": "application/pdf",
      "zip": "application/zip",
      "tar": "application/x-tar",
      "gz": "application/gzip",
      "mp4": "video/mp4",
      "mp3": "audio/mpeg",
      "wav": "audio/wav",
      "ogg": "audio/ogg",
      "csv": "text/csv",
      "yaml": "application/x-yaml",
      "yml": "application/x-yaml"
    };
    return map[extension.toLowerCase()] || "application/octet-stream";
  }

  public static getExtension(mimeType: string): string | undefined {
    const map: Record<string, string> = {
      "text/plain": "txt",
      "text/html": "html",
      "text/css": "css",
      "application/javascript": "js",
      "application/json": "json",
      "application/xml": "xml",
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/gif": "gif",
      "image/webp": "webp",
      "image/svg+xml": "svg",
      "application/pdf": "pdf",
      "application/zip": "zip",
      "application/x-tar": "tar",
      "application/gzip": "gz",
      "video/mp4": "mp4",
      "audio/mpeg": "mp3",
      "audio/wav": "wav",
      "audio/ogg": "ogg",
      "text/csv": "csv",
      "application/x-yaml": "yaml"
    };
    return map[mimeType];
  }

  public static parse(contentType: string): MIMEType {
    return new MIMEType(contentType);
  }

  public static isText(mimeType: string): boolean {
    const type = new MIMEType(mimeType);
    return type.match("text/*") || type.match("application/json") || type.match("application/xml");
  }

  public static isImage(mimeType: string): boolean {
    const type = new MIMEType(mimeType);
    return type.match("image/*");
  }

  public static isAudio(mimeType: string): boolean {
    const type = new MIMEType(mimeType);
    return type.match("audio/*");
  }

  public static isVideo(mimeType: string): boolean {
    const type = new MIMEType(mimeType);
    return type.match("video/*");
  }

  public static isApplication(mimeType: string): boolean {
    const type = new MIMEType(mimeType);
    return type.match("application/*");
  }
}