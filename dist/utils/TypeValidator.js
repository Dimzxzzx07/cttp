"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeValidator = void 0;
class TypeValidator {
    isString(value) {
        return typeof value === "string";
    }
    isNumber(value) {
        return typeof value === "number" && !isNaN(value);
    }
    isInteger(value) {
        return this.isNumber(value) && Number.isInteger(value);
    }
    isBoolean(value) {
        return typeof value === "boolean";
    }
    isObject(value) {
        return typeof value === "object" && value !== null && !Array.isArray(value);
    }
    isArray(value) {
        return Array.isArray(value);
    }
    isBuffer(value) {
        return Buffer.isBuffer(value);
    }
    isDate(value) {
        return value instanceof Date && !isNaN(value.getTime());
    }
    isFunction(value) {
        return typeof value === "function";
    }
    isUndefined(value) {
        return value === undefined;
    }
    isNull(value) {
        return value === null;
    }
    isNil(value) {
        return this.isUndefined(value) || this.isNull(value);
    }
    isEmail(value) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    }
    isURL(value) {
        try {
            new URL(value);
            return true;
        }
        catch {
            return false;
        }
    }
    isIP(value) {
        const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/;
        const ipv6 = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        return ipv4.test(value) || ipv6.test(value);
    }
    isUUID(value) {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return regex.test(value);
    }
    isHex(value) {
        return /^[0-9a-fA-F]+$/.test(value) && value.length % 2 === 0;
    }
    isBase64(value) {
        try {
            return Buffer.from(value, "base64").toString("base64") === value;
        }
        catch {
            return false;
        }
    }
    isJSON(value) {
        try {
            JSON.parse(value);
            return true;
        }
        catch {
            return false;
        }
    }
    isPositive(value) {
        return this.isNumber(value) && value > 0;
    }
    isNegative(value) {
        return this.isNumber(value) && value < 0;
    }
    isNonNegative(value) {
        return this.isNumber(value) && value >= 0;
    }
    isNonPositive(value) {
        return this.isNumber(value) && value <= 0;
    }
    isInRange(value, min, max) {
        return this.isNumber(value) && value >= min && value <= max;
    }
    isLength(value, min, max) {
        const length = this.isString(value) ? value.length : value instanceof Buffer ? value.length : undefined;
        if (length === undefined) {
            return false;
        }
        return length >= min && length <= max;
    }
    isBooleanString(value) {
        return value === "true" || value === "false";
    }
    isNumericString(value) {
        return /^-?\d+(\.\d+)?$/.test(value);
    }
}
exports.TypeValidator = TypeValidator;
//# sourceMappingURL=TypeValidator.js.map