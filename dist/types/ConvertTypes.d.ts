/// <reference types="node" />
/// <reference types="node" />
export declare namespace ConvertTypes {
    interface ConvertOptions {
        file: string | Buffer;
        targetFormat: string;
        options?: any;
        quality?: number;
        width?: number;
        height?: number;
    }
    interface ConvertResult {
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
//# sourceMappingURL=ConvertTypes.d.ts.map