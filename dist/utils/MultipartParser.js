"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipartParser = void 0;
class MultipartParser {
    constructor(boundary) {
        this.boundary = boundary;
        this.buffer = Buffer.alloc(0);
        this.parts = [];
        this.state = "boundary";
    }
    parse(data) {
        this.buffer = Buffer.concat([this.buffer, data]);
        this.processBuffer();
        return this.parts;
    }
    processBuffer() {
        while (this.buffer.length > 0) {
            if (this.state === "boundary") {
                const boundaryIndex = this.buffer.indexOf("--" + this.boundary);
                if (boundaryIndex === -1)
                    break;
                this.buffer = this.buffer.subarray(boundaryIndex + this.boundary.length + 2);
                this.state = "header";
                continue;
            }
            if (this.state === "header") {
                const headerEnd = this.buffer.indexOf("\r\n\r\n");
                if (headerEnd === -1)
                    break;
                const headerData = this.buffer.subarray(0, headerEnd).toString("utf8");
                this.buffer = this.buffer.subarray(headerEnd + 4);
                const headers = this.parseHeaders(headerData);
                const part = { headers, body: Buffer.alloc(0) };
                this.parts.push(part);
                this.state = "body";
                continue;
            }
            if (this.state === "body") {
                const part = this.parts[this.parts.length - 1];
                const boundaryIndex = this.buffer.indexOf("--" + this.boundary);
                if (boundaryIndex === -1) {
                    part.body = Buffer.concat([part.body, this.buffer]);
                    this.buffer = Buffer.alloc(0);
                    break;
                }
                const bodyData = this.buffer.subarray(0, boundaryIndex);
                part.body = Buffer.concat([part.body, bodyData]);
                this.buffer = this.buffer.subarray(boundaryIndex + this.boundary.length + 2);
                this.state = "boundary";
                const bufferStr = this.buffer.toString();
                if (bufferStr.startsWith("--")) {
                    this.state = "complete";
                    break;
                }
                continue;
            }
            if (this.state === "complete")
                break;
        }
    }
    parseHeaders(headerData) {
        const headers = {};
        const lines = headerData.split("\r\n");
        for (const line of lines) {
            if (!line.trim())
                continue;
            const [key, ...valueParts] = line.split(":");
            if (key && valueParts.length > 0) {
                headers[key.trim().toLowerCase()] = valueParts.join(":").trim();
            }
        }
        return headers;
    }
    getParts() {
        return this.parts;
    }
    getFiles() {
        return this.parts.filter(part => {
            const disp = part.headers["content-disposition"] || "";
            return disp.includes("filename");
        });
    }
    getFields() {
        return this.parts.filter(part => {
            const disp = part.headers["content-disposition"] || "";
            return !disp.includes("filename");
        });
    }
    reset() {
        this.buffer = Buffer.alloc(0);
        this.parts = [];
        this.state = "boundary";
    }
    isComplete() {
        return this.state === "complete";
    }
}
exports.MultipartParser = MultipartParser;
//# sourceMappingURL=MultipartParser.js.map