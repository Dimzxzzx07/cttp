"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MIMEType = void 0;
class MIMEType {
    constructor(type) {
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
    getType() {
        return this.type;
    }
    getSubtype() {
        return this.subtype;
    }
    getParameters() {
        return new Map(this.parameters);
    }
    getParameter(key) {
        return this.parameters.get(key);
    }
    setParameter(key, value) {
        this.parameters.set(key, value);
    }
    removeParameter(key) {
        this.parameters.delete(key);
    }
    toString() {
        let result = `${this.type}/${this.subtype}`;
        for (const [key, value] of this.parameters) {
            result += `; ${key}=${value}`;
        }
        return result;
    }
    isType(type) {
        return this.type === type;
    }
    isSubtype(subtype) {
        return this.subtype === subtype;
    }
    match(pattern) {
        const [type, subtype] = pattern.split("/");
        if (type && type !== "*" && this.type !== type) {
            return false;
        }
        if (subtype && subtype !== "*" && this.subtype !== subtype) {
            return false;
        }
        return true;
    }
    static fromExtension(extension) {
        const map = {
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
    static getExtension(mimeType) {
        const map = {
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
    static parse(contentType) {
        return new MIMEType(contentType);
    }
    static isText(mimeType) {
        const type = new MIMEType(mimeType);
        return type.match("text/*") || type.match("application/json") || type.match("application/xml");
    }
    static isImage(mimeType) {
        const type = new MIMEType(mimeType);
        return type.match("image/*");
    }
    static isAudio(mimeType) {
        const type = new MIMEType(mimeType);
        return type.match("audio/*");
    }
    static isVideo(mimeType) {
        const type = new MIMEType(mimeType);
        return type.match("video/*");
    }
    static isApplication(mimeType) {
        const type = new MIMEType(mimeType);
        return type.match("application/*");
    }
}
exports.MIMEType = MIMEType;
//# sourceMappingURL=MIMEType.js.map