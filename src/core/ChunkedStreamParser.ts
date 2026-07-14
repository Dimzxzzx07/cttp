export class ChunkedStreamParser {
  private buffer: Buffer;
  private state: "header" | "data" | "trailer" | "complete";
  private chunkSize: number;
  private body: Buffer;
  private trailer: Map<string, string>;

  constructor() {
    this.buffer = Buffer.alloc(0);
    this.state = "header";
    this.chunkSize = 0;
    this.body = Buffer.alloc(0);
    this.trailer = new Map();
  }

  public parse(data: Buffer): { complete: boolean; body: Buffer; trailer?: Map<string, string> } {
    this.buffer = Buffer.concat([this.buffer, data]);
    
    while (this.buffer.length > 0) {
      if (this.state === "header") {
        const headerEnd = this.buffer.indexOf("\r\n");
        if (headerEnd === -1) break;
        
        const header = this.buffer.subarray(0, headerEnd).toString();
        this.chunkSize = parseInt(header, 16);
        this.buffer = this.buffer.subarray(headerEnd + 2);
        
        if (this.chunkSize === 0) {
          this.state = "trailer";
          continue;
        }
        this.state = "data";
      }
      
      if (this.state === "data") {
        if (this.buffer.length < this.chunkSize + 2) break;
        
        const chunk = this.buffer.subarray(0, this.chunkSize);
        this.body = Buffer.concat([this.body, chunk]);
        this.buffer = this.buffer.subarray(this.chunkSize + 2);
        this.state = "header";
      }
      
      if (this.state === "trailer") {
        const trailerEnd = this.buffer.indexOf("\r\n\r\n");
        if (trailerEnd === -1) break;
        
        const trailerData = this.buffer.subarray(0, trailerEnd).toString();
        const lines = trailerData.split("\r\n");
        for (const line of lines) {
          const [key, ...valueParts] = line.split(":");
          if (key && valueParts.length > 0) {
            this.trailer.set(key.trim(), valueParts.join(":").trim());
          }
        }
        
        this.buffer = this.buffer.subarray(trailerEnd + 4);
        this.state = "complete";
        break;
      }
    }
    
    if (this.state === "complete") {
      const result = {
        complete: true,
        body: this.body,
        trailer: this.trailer
      };
      this.reset();
      return result;
    }
    
    return {
      complete: false,
      body: this.body,
      trailer: this.trailer
    };
  }

  private reset(): void {
    this.buffer = Buffer.alloc(0);
    this.state = "header";
    this.chunkSize = 0;
    this.body = Buffer.alloc(0);
    this.trailer.clear();
  }
}