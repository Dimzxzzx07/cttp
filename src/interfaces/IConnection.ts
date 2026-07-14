export interface IConnection {
  getURL(): string;
  isAlive(): boolean;
  write(data: Buffer): Promise<void>;
  read(): Promise<Buffer>;
  close(): Promise<void>;
  getSocket(): any;
}