export declare class TypeValidator {
    isString(value: any): boolean;
    isNumber(value: any): boolean;
    isInteger(value: any): boolean;
    isBoolean(value: any): boolean;
    isObject(value: any): boolean;
    isArray(value: any): boolean;
    isBuffer(value: any): boolean;
    isDate(value: any): boolean;
    isFunction(value: any): boolean;
    isUndefined(value: any): boolean;
    isNull(value: any): boolean;
    isNil(value: any): boolean;
    isEmail(value: string): boolean;
    isURL(value: string): boolean;
    isIP(value: string): boolean;
    isUUID(value: string): boolean;
    isHex(value: string): boolean;
    isBase64(value: string): boolean;
    isJSON(value: string): boolean;
    isPositive(value: number): boolean;
    isNegative(value: number): boolean;
    isNonNegative(value: number): boolean;
    isNonPositive(value: number): boolean;
    isInRange(value: number, min: number, max: number): boolean;
    isLength(value: any, min: number, max: number): boolean;
    isBooleanString(value: string): boolean;
    isNumericString(value: string): boolean;
}
//# sourceMappingURL=TypeValidator.d.ts.map