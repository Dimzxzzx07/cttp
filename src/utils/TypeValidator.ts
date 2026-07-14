export class TypeValidator {
  public isString(value: any): boolean {
    return typeof value === "string";
  }

  public isNumber(value: any): boolean {
    return typeof value === "number" && !isNaN(value);
  }

  public isInteger(value: any): boolean {
    return this.isNumber(value) && Number.isInteger(value);
  }

  public isBoolean(value: any): boolean {
    return typeof value === "boolean";
  }

  public isObject(value: any): boolean {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  public isArray(value: any): boolean {
    return Array.isArray(value);
  }

  public isBuffer(value: any): boolean {
    return Buffer.isBuffer(value);
  }

  public isDate(value: any): boolean {
    return value instanceof Date && !isNaN(value.getTime());
  }

  public isFunction(value: any): boolean {
    return typeof value === "function";
  }

  public isUndefined(value: any): boolean {
    return value === undefined;
  }

  public isNull(value: any): boolean {
    return value === null;
  }

  public isNil(value: any): boolean {
    return this.isUndefined(value) || this.isNull(value);
  }

  public isEmail(value: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  }

  public isURL(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  public isIP(value: string): boolean {
    const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6 = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4.test(value) || ipv6.test(value);
  }

  public isUUID(value: string): boolean {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regex.test(value);
  }

  public isHex(value: string): boolean {
    return /^[0-9a-fA-F]+$/.test(value) && value.length % 2 === 0;
  }

  public isBase64(value: string): boolean {
    try {
      return Buffer.from(value, "base64").toString("base64") === value;
    } catch {
      return false;
    }
  }

  public isJSON(value: string): boolean {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  }

  public isPositive(value: number): boolean {
    return this.isNumber(value) && value > 0;
  }

  public isNegative(value: number): boolean {
    return this.isNumber(value) && value < 0;
  }

  public isNonNegative(value: number): boolean {
    return this.isNumber(value) && value >= 0;
  }

  public isNonPositive(value: number): boolean {
    return this.isNumber(value) && value <= 0;
  }

  public isInRange(value: number, min: number, max: number): boolean {
    return this.isNumber(value) && value >= min && value <= max;
  }

  public isLength(value: any, min: number, max: number): boolean {
    const length = this.isString(value) ? value.length : value instanceof Buffer ? value.length : undefined;
    if (length === undefined) {
      return false;
    }
    return length >= min && length <= max;
  }

  public isBooleanString(value: string): boolean {
    return value === "true" || value === "false";
  }

  public isNumericString(value: string): boolean {
    return /^-?\d+(\.\d+)?$/.test(value);
  }
}