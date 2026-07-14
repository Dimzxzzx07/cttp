export interface IStream {
  getId(): string;
  write(data: Buffer): Promise<void>;
  read(): Promise<Buffer>;
  close(): Promise<void>;
  isOpen(): boolean;
  getPriority(): number;
  setPriority(priority: number): void;
}