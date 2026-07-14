/// <reference types="node" />
/// <reference types="node" />
export declare class JSONParser {
    parse(data: string): any;
    stringify(data: any, pretty?: boolean): string;
    parseStream(data: Buffer): any;
    stringifyStream(data: any, pretty?: boolean): Buffer;
    isValid(data: string): boolean;
    parseSafe(data: string, fallback?: any): any;
    stringifySafe(data: any, fallback?: string): string;
    deepClone<T>(obj: T): T;
    merge<T extends object, U extends object>(target: T, source: U): T & U;
    deepMerge<T extends object, U extends object>(target: T, source: U): T & U;
    flatten(obj: any, prefix?: string): Record<string, any>;
    unflatten(obj: Record<string, any>): any;
    pick(obj: any, keys: string[]): any;
    omit(obj: any, keys: string[]): any;
}
//# sourceMappingURL=JSONParser.d.ts.map