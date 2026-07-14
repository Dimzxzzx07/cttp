export declare class MIMEType {
    private type;
    private subtype;
    private parameters;
    constructor(type: string);
    getType(): string;
    getSubtype(): string;
    getParameters(): Map<string, string>;
    getParameter(key: string): string | undefined;
    setParameter(key: string, value: string): void;
    removeParameter(key: string): void;
    toString(): string;
    isType(type: string): boolean;
    isSubtype(subtype: string): boolean;
    match(pattern: string): boolean;
    static fromExtension(extension: string): string;
    static getExtension(mimeType: string): string | undefined;
    static parse(contentType: string): MIMEType;
    static isText(mimeType: string): boolean;
    static isImage(mimeType: string): boolean;
    static isAudio(mimeType: string): boolean;
    static isVideo(mimeType: string): boolean;
    static isApplication(mimeType: string): boolean;
}
//# sourceMappingURL=MIMEType.d.ts.map