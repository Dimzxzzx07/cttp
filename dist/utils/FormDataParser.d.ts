/// <reference types="node" />
/// <reference types="node" />
export declare class FormDataParser {
    parse(data: Buffer | string): Record<string, string>;
    stringify(data: Record<string, any>): string;
    parseStream(data: Buffer): Record<string, string>;
    stringifyStream(data: Record<string, any>): Buffer;
    getValue(data: Record<string, string>, key: string): string | undefined;
    getValues(data: Record<string, string>, key: string): string[];
    hasKey(data: Record<string, string>, key: string): boolean;
    removeKey(data: Record<string, string>, key: string): void;
    merge(base: Record<string, string>, additional: Record<string, string>): Record<string, string>;
    isFormData(data: any): boolean;
}
//# sourceMappingURL=FormDataParser.d.ts.map