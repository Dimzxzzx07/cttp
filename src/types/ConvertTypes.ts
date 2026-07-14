export namespace ConvertTypes {
  export interface ConvertOptions {
    file: string | Buffer;
    targetFormat: string;
    options?: any;
    quality?: number;
    width?: number;
    height?: number;
  }

  export interface ConvertResult {
    file: string;
    format: string;
    size: number;
    hash: string;
    convertedAt: string;
    width?: number;
    height?: number;
    quality?: number;
  }
}