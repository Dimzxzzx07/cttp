export declare class QueryBuilder {
    static build(params: Map<string, string>): string;
    static parse(query: string): Map<string, string>;
    static addParam(params: Map<string, string>, key: string, value: string): void;
    static removeParam(params: Map<string, string>, key: string): void;
    static hasParam(params: Map<string, string>, key: string): boolean;
    static getParam(params: Map<string, string>, key: string): string | undefined;
    static encode(value: any): string;
    static decode(value: string): any;
}
//# sourceMappingURL=QueryBuilder.d.ts.map