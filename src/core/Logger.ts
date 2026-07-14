import { ConfigTypes } from "../types/ConfigTypes";

export class Logger {
  private level: string;
  private levels: Map<string, number>;
  private enabled: boolean;
  private prefix: string;

  constructor(level: string = "info") {
    this.level = level;
    this.levels = new Map([
      ["error", 0],
      ["warn", 1],
      ["info", 2],
      ["debug", 3],
      ["trace", 4]
    ]);
    this.enabled = true;
    this.prefix = "[CTTP]";
  }

  public error(message: string, ...args: any[]): void {
    this.log("error", message, args);
  }

  public warn(message: string, ...args: any[]): void {
    this.log("warn", message, args);
  }

  public info(message: string, ...args: any[]): void {
    this.log("info", message, args);
  }

  public debug(message: string, ...args: any[]): void {
    this.log("debug", message, args);
  }

  public trace(message: string, ...args: any[]): void {
    this.log("trace", message, args);
  }

  private log(level: string, message: string, args: any[]): void {
    if (!this.enabled) return;
    if (!this.shouldLog(level)) return;
    
    const timestamp = new Date().toISOString();
    const formatted = `${timestamp} ${this.prefix} [${level.toUpperCase()}] ${message}`;
    const output = args.length > 0 ? `${formatted} ${args.map(a => JSON.stringify(a)).join(" ")}` : formatted;
    
    if (level === "error") {
      console.error(output);
    } else {
      console.log(output);
    }
  }

  private shouldLog(level: string): boolean {
    const currentLevel = this.levels.get(this.level) || 0;
    const messageLevel = this.levels.get(level) || 0;
    return messageLevel <= currentLevel;
  }

  public setLevel(level: string): void {
    this.level = level;
  }

  public getLevel(): string {
    return this.level;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setPrefix(prefix: string): void {
    this.prefix = prefix;
  }

  public getPrefix(): string {
    return this.prefix;
  }
}