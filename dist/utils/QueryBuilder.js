"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
class QueryBuilder {
    static build(params) {
        if (!params || params.size === 0) {
            return "";
        }
        const parts = [];
        for (const [key, value] of params) {
            if (value !== undefined && value !== null) {
                parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
            }
        }
        return parts.length > 0 ? `?${parts.join("&")}` : "";
    }
    static parse(query) {
        const result = new Map();
        if (!query || !query.startsWith("?")) {
            return result;
        }
        const cleanQuery = query.substring(1);
        const pairs = cleanQuery.split("&");
        for (const pair of pairs) {
            const [key, value] = pair.split("=");
            if (key) {
                result.set(decodeURIComponent(key), value ? decodeURIComponent(value) : "");
            }
        }
        return result;
    }
    static addParam(params, key, value) {
        params.set(key, value);
    }
    static removeParam(params, key) {
        params.delete(key);
    }
    static hasParam(params, key) {
        return params.has(key);
    }
    static getParam(params, key) {
        return params.get(key);
    }
    static encode(value) {
        if (typeof value === "object") {
            return encodeURIComponent(JSON.stringify(value));
        }
        return encodeURIComponent(String(value));
    }
    static decode(value) {
        try {
            return JSON.parse(decodeURIComponent(value));
        }
        catch {
            return decodeURIComponent(value);
        }
    }
}
exports.QueryBuilder = QueryBuilder;
//# sourceMappingURL=QueryBuilder.js.map