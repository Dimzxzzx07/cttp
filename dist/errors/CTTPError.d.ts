export declare class CTTPError extends Error {
    private status;
    private code;
    private details;
    constructor(status: number, message: string, code?: string, details?: any);
    getStatus(): number;
    getCode(): string;
    getDetails(): any;
    toJSON(): any;
}
//# sourceMappingURL=CTTPError.d.ts.map