"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONParser = void 0;
class JSONParser {
    parse(data) {
        return JSON.parse(data);
    }
    stringify(data, pretty) {
        if (pretty) {
            return JSON.stringify(data, null, 2);
        }
        return JSON.stringify(data);
    }
    parseStream(data) {
        return this.parse(data.toString("utf8"));
    }
    stringifyStream(data, pretty) {
        return Buffer.from(this.stringify(data, pretty), "utf8");
    }
    isValid(data) {
        try {
            JSON.parse(data);
            return true;
        }
        catch {
            return false;
        }
    }
    parseSafe(data, fallback) {
        try {
            return this.parse(data);
        }
        catch {
            return fallback || null;
        }
    }
    stringifySafe(data, fallback) {
        try {
            return this.stringify(data);
        }
        catch {
            return fallback || "";
        }
    }
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    merge(target, source) {
        const result = { ...target, ...source };
        return result;
    }
    deepMerge(target, source) {
        const result = { ...target };
        for (const key of Object.keys(source)) {
            const value = source[key];
            if (value && typeof value === "object" && !Array.isArray(value) && result[key] && typeof result[key] === "object") {
                result[key] = this.deepMerge(result[key], value);
            }
            else {
                result[key] = value;
            }
        }
        return result;
    }
    flatten(obj, prefix) {
        const result = {};
        const pre = prefix || "";
        for (const key of Object.keys(obj)) {
            const value = obj[key];
            const newKey = pre ? `${pre}.${key}` : key;
            if (value && typeof value === "object" && !Array.isArray(value)) {
                Object.assign(result, this.flatten(value, newKey));
            }
            else {
                result[newKey] = value;
            }
        }
        return result;
    }
    unflatten(obj) {
        const result = {};
        for (const key of Object.keys(obj)) {
            const parts = key.split(".");
            let current = result;
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                if (i === parts.length - 1) {
                    current[part] = obj[key];
                }
                else {
                    current[part] = current[part] || {};
                    current = current[part];
                }
            }
        }
        return result;
    }
    pick(obj, keys) {
        const result = {};
        for (const key of keys) {
            if (key in obj) {
                result[key] = obj[key];
            }
        }
        return result;
    }
    omit(obj, keys) {
        const result = {};
        for (const key of Object.keys(obj)) {
            if (!keys.includes(key)) {
                result[key] = obj[key];
            }
        }
        return result;
    }
}
exports.JSONParser = JSONParser;
//# sourceMappingURL=JSONParser.js.map