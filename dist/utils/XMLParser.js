"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XMLParser = void 0;
class XMLParser {
    parse(data) {
        const xml2js = require("xml2js");
        const parser = new xml2js.Parser({ explicitArray: false });
        let result = {};
        parser.parseString(data, (err, res) => {
            if (err)
                throw err;
            result = res;
        });
        return result;
    }
    stringify(data) {
        const xml2js = require("xml2js");
        const builder = new xml2js.Builder();
        return builder.buildObject(data);
    }
    isValid(data) {
        try {
            this.parse(data);
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
}
exports.XMLParser = XMLParser;
//# sourceMappingURL=XMLParser.js.map