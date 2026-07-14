import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
import { CTTPResponse } from "../core/CTTPResponse";
import { HTTPVersion } from "../core/HTTPVersion";

export class UploadHandler implements IMethodHandler {
  private uploads: Map<string, any>;

  constructor() {
    this.uploads = new Map();
  }

  public async handle(request: IHTTPRequest): Promise<IHTTPResponse> {
    const body = request.getBody();
    const file = body?.file;
    const resumable = body?.resumable || false;
    const sessionId = body?.sessionId || this.generateSessionId();
    
    if (!file) {
      return new CTTPResponse(
        400,
        "Bad Request",
        HTTPVersion.HTTP_1_1,
        new Map([["Content-Type", "application/json"]]),
        { error: "Missing file" }
      );
    }
    
    if (resumable) {
      return this.handleResumableUpload(request, sessionId, file);
    }
    
    const fileBuffer = Buffer.from(file);
    const fileSize = fileBuffer.length;
    const fileHash = this.calculateHash(fileBuffer);
    const fileUrl = this.generateFileUrl(sessionId);
    
    const response = {
      sessionId,
      fileUrl,
      fileSize,
      fileHash,
      status: "completed",
      uploadedAt: new Date().toISOString()
    };
    
    return new CTTPResponse(
      200,
      "OK",
      HTTPVersion.HTTP_1_1,
      new Map([["Content-Type", "application/json"]]),
      response
    );
  }

  private async handleResumableUpload(
    request: IHTTPRequest,
    sessionId: string,
    file: any
  ): Promise<IHTTPResponse> {
    const chunk = Buffer.from(file);
    const chunkIndex = request.getBody()?.chunkIndex || 0;
    const totalChunks = request.getBody()?.totalChunks || 1;
    const chunkHash = this.calculateHash(chunk);
    
    if (!this.uploads.has(sessionId)) {
      this.uploads.set(sessionId, {
        chunks: new Map(),
        totalChunks: totalChunks,
        completed: false
      });
    }
    
    const session = this.uploads.get(sessionId);
    session.chunks.set(chunkIndex, { data: chunk, hash: chunkHash });
    
    if (session.chunks.size === totalChunks) {
      session.completed = true;
      const assembled = this.assembleChunks(session.chunks);
      const fileUrl = this.generateFileUrl(sessionId);
      const fileHash = this.calculateHash(assembled);
      
      return new CTTPResponse(
        200,
        "OK",
        HTTPVersion.HTTP_1_1,
        new Map([["Content-Type", "application/json"]]),
        {
          sessionId,
          fileUrl,
          fileSize: assembled.length,
          fileHash,
          status: "completed",
          uploadedAt: new Date().toISOString()
        }
      );
    }
    
    return new CTTPResponse(
      202,
      "Accepted",
      HTTPVersion.HTTP_1_1,
      new Map([["Content-Type", "application/json"]]),
      {
        sessionId,
        chunkIndex,
        totalChunks,
        status: "uploading",
        progress: (session.chunks.size / totalChunks) * 100
      }
    );
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  private calculateHash(data: Buffer): string {
    const crypto = require("crypto");
    return crypto.createHash("sha256").update(data).digest("hex");
  }

  private generateFileUrl(sessionId: string): string {
    return `/uploads/${sessionId}/file`;
  }

  private assembleChunks(chunks: Map<number, any>): Buffer {
    const sorted = Array.from(chunks.entries()).sort((a, b) => a[0] - b[0]);
    const buffers = sorted.map(([_, chunk]) => chunk.data);
    return Buffer.concat(buffers);
  }
}