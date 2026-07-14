"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormDataParser = void 0;
class FormDataParser {
    parse(data) {
        const buffer = typeof data === "string" ? Buffer.from(data) : data;
        const text = buffer.toString("utf8");
        const pairs = text.split("&");
        const result = {};
        for (const pair of pairs) {
            const [key, value] = pair.split("=");
            if (key) {
                result[decodeURIComponent(key)] = value ? decodeURIComponent(value) : "";
            }
        }
        return result;
    }
    stringify(data) {
        const pairs = [];
        for (const key of Object.keys(data)) {
            const value = data[key];
            if (value === undefined || value === null) {
                continue;
            }
            if (Array.isArray(value)) {
                for (const item of value) {
                    pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
                }
            }
            else {
                pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
            }
        }
        return pairs.join("&");
    }
    parseStream(data) {
        return this.parse(data);
    }
    stringifyStream(data) {
        return Buffer.from(this.stringify(data), "utf8");
    }
    getValue(data, key) {
        return data[key];
    }
    getValues(data, key) {
        const result = [];
        for (const k of Object.keys(data)) {
            if (k === key) {
                result.push(data[k]);
            }
        }
        return result;
    }
    hasKey(data, key) {
        return key in data;
    }
    removeKey(data, key) {
        delete data[key];
    }
    merge(base, additional) {
        return { ...base, ...additional };
    }
    isFormData(data) {
        return typeof data === "object" && data !== null && !Array.isArray(data) && typeof data.toString === "function";
    }
}
exports.FormDataParser = FormDataParser;
//# sourceMappingURL=FormDataParser.js.map