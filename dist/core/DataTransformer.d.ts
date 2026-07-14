export declare class DataTransformer {
    private transformers;
    private reverseTransformers;
    constructor();
    private registerDefaultTransformers;
    register(name: string, transformer: (data: any) => any, reverse?: (data: any) => any): void;
    transform(data: any, type: string): any;
    reverse(data: any, type: string): any;
    hasTransformer(type: string): boolean;
    hasReverseTransformer(type: string): boolean;
    getTransformerNames(): string[];
    removeTransformer(type: string): void;
    clear(): void;
}
//# sourceMappingURL=DataTransformer.d.ts.map