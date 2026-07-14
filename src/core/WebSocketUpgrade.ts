export class WebSocketUpgrade {
  private connections: Map<string, any>;
  private protocols: string[];
  private maxFrameSize: number;

  constructor() {
    this.connections = new Map();
    this.protocols = ["ws", "wss"];
    this.maxFrameSize = 1048576;
  }

  public async upgrade(request: any, socket: any): Promise<void> {
    const upgrade = request.headers["upgrade"];
    const connection = request.headers["connection"];

    if (!upgrade || upgrade.toLowerCase() !== "websocket") {
      return;
    }

    const key = request.headers["sec-websocket-key"];
    const version = request.headers["sec-websocket-version"];
    const protocol = request.headers["sec-websocket-protocol"];

    if (!key || version !== "13") {
      socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
      return;
    }

    const acceptKey = this.generateAcceptKey(key);
    const response = [
      "HTTP/1.1 101 Switching Protocols",
      "Upgrade: websocket",
      "Connection: Upgrade",
      `Sec-WebSocket-Accept: ${acceptKey}`,
      protocol ? `Sec-WebSocket-Protocol: ${protocol}` : "",
      "\r\n"
    ].filter(Boolean).join("\r\n");

    socket.write(response);

    const ws = this.createWebSocket(socket);
    const id = this.generateConnectionId();
    this.connections.set(id, ws);

    ws.on("message", (data: Buffer) => {
      this.handleMessage(id, data);
    });

    ws.on("close", () => {
      this.connections.delete(id);
    });

    return ws;
  }

  private generateAcceptKey(key: string): string {
    const crypto = require("crypto");
    const magic = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
    const hash = crypto.createHash("sha1").update(key + magic).digest("base64");
    return hash;
  }

  private createWebSocket(socket: any): any {
    const EventEmitter = require("events");
    const ws = new EventEmitter();

    ws.send = (data: Buffer | string) => {
      const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
      const frame = this.buildFrame(buffer);
      socket.write(frame);
    };

    ws.close = () => {
      const frame = this.buildCloseFrame();
      socket.write(frame);
      socket.destroy();
    };

    ws.on("message", () => {});
    ws.on("close", () => {});

    return ws;
  }

  private buildFrame(data: Buffer): Buffer {
    const length = data.length;
    const header = Buffer.alloc(2);
    header[0] = 0x82;

    if (length <= 125) {
      header[1] = length;
      return Buffer.concat([header, data]);
    } else if (length <= 65535) {
      header[1] = 126;
      const extended = Buffer.alloc(2);
      extended.writeUInt16BE(length, 0);
      return Buffer.concat([header, extended, data]);
    } else {
      header[1] = 127;
      const extended = Buffer.alloc(8);
      extended.writeUInt32BE(Math.floor(length / 0x100000000), 0);
      extended.writeUInt32BE(length & 0xFFFFFFFF, 4);
      return Buffer.concat([header, extended, data]);
    }
  }

  private buildCloseFrame(): Buffer {
    const frame = Buffer.alloc(4);
    frame[0] = 0x88;
    frame[1] = 0x02;
    return frame;
  }

  private handleMessage(id: string, data: Buffer): void {
    const ws = this.connections.get(id);
    if (ws) {
      const parsed = this.parseFrame(data);
      if (parsed) {
        ws.emit("message", parsed);
      }
    }
  }

  private parseFrame(data: Buffer): Buffer | null {
    if (data.length < 2) {
      return null;
    }

    const opcode = data[0] & 0x0f;
    const mask = (data[1] & 0x80) !== 0;
    let length = data[1] & 0x7f;
    let offset = 2;

    if (length === 126) {
      length = data.readUInt16BE(offset);
      offset += 2;
    } else if (length === 127) {
      length = data.readUInt32BE(offset + 4);
      offset += 8;
    }

    if (mask) {
      const maskKey = data.subarray(offset, offset + 4);
      const payload = data.subarray(offset + 4, offset + 4 + length);
      const unmasked = Buffer.alloc(payload.length);
      for (let i = 0; i < payload.length; i++) {
        unmasked[i] = payload[i] ^ maskKey[i % 4];
      }
      return unmasked;
    }

    return data.subarray(offset, offset + length);
  }

  private generateConnectionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  public getConnections(): number {
    return this.connections.size;
  }

  public getProtocols(): string[] {
    return [...this.protocols];
  }

  public addProtocol(protocol: string): void {
    if (!this.protocols.includes(protocol)) {
      this.protocols.push(protocol);
    }
  }

  public removeProtocol(protocol: string): void {
    const index = this.protocols.indexOf(protocol);
    if (index !== -1) {
      this.protocols.splice(index, 1);
    }
  }

  public setMaxFrameSize(size: number): void {
    this.maxFrameSize = Math.max(1024, size);
  }

  public getMaxFrameSize(): number {
    return this.maxFrameSize;
  }
}