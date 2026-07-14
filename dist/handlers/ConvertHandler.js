"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertHandler = void 0;
const CTTPResponse_1 = require("../core/CTTPResponse");
const HTTPVersion_1 = require("../core/HTTPVersion");
class ConvertHandler {
    constructor() {
        this.converters = new Map();
        this.registerDefaultConverters();
    }
    registerDefaultConverters() {
        this.register("png-to-webp", this.convertPNGToWebP.bind(this));
        this.register("jpg-to-webp", this.convertJPGToWebP.bind(this));
        this.register("png-to-jpg", this.convertPNGToJPG.bind(this));
        this.register("webp-to-png", this.convertWebPToPNG.bind(this));
        this.register("json-to-xml", this.convertJSONToXML.bind(this));
        this.register("xml-to-json", this.convertXMLToJSON.bind(this));
        this.register("csv-to-json", this.convertCSVToJSON.bind(this));
        this.register("json-to-csv", this.convertJSONToCSV.bind(this));
        this.register("text-to-base64", this.convertTextToBase64.bind(this));
        this.register("base64-to-text", this.convertBase64ToText.bind(this));
    }
    register(name, converter) {
        this.converters.set(name, converter);
    }
    async handle(request) {
        const body = request.getBody();
        const file = body?.file;
        const targetFormat = body?.targetFormat;
        const options = body?.options || {};
        if (!file) {
            return new CTTPResponse_1.CTTPResponse(400, "Bad Request", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), { error: "Missing file" });
        }
        if (!targetFormat) {
            return new CTTPResponse_1.CTTPResponse(400, "Bad Request", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), { error: "Missing target format" });
        }
        const fileBuffer = Buffer.isBuffer(file) ? file : Buffer.from(file);
        const sourceFormat = this.detectFormat(fileBuffer);
        const converterKey = `${sourceFormat}-to-${targetFormat}`;
        const converter = this.converters.get(converterKey);
        if (!converter) {
            return new CTTPResponse_1.CTTPResponse(400, "Bad Request", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), { error: `No converter found for ${sourceFormat} to ${targetFormat}` });
        }
        try {
            const converted = converter(fileBuffer, options);
            const result = {
                file: converted.toString("base64"),
                format: targetFormat,
                size: converted.length,
                hash: this.calculateHash(converted),
                convertedAt: new Date().toISOString()
            };
            return new CTTPResponse_1.CTTPResponse(200, "OK", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), result);
        }
        catch (error) {
            return new CTTPResponse_1.CTTPResponse(500, "Internal Server Error", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), { error: "Conversion failed", details: error.message });
        }
    }
    detectFormat(buffer) {
        const signature = buffer.subarray(0, 8);
        const hex = signature.toString("hex");
        if (hex.startsWith("89504e47"))
            return "png";
        if (hex.startsWith("ffd8ff"))
            return "jpg";
        if (hex.startsWith("52494646") && buffer.subarray(8, 12).toString("hex") === "57454250")
            return "webp";
        if (buffer.toString("utf8", 0, 5) === "<?xml")
            return "xml";
        if (buffer.toString("utf8", 0, 1) === "{")
            return "json";
        if (buffer.toString("utf8", 0, 1) === "[")
            return "json";
        const text = buffer.toString("utf8", 0, 100);
        if (text.includes(","))
            return "csv";
        return "text";
    }
    convertPNGToWebP(data, options) {
        const sharp = require("sharp");
        return sharp(data).webp(options).toBuffer();
    }
    convertJPGToWebP(data, options) {
        const sharp = require("sharp");
        return sharp(data).webp(options).toBuffer();
    }
    convertPNGToJPG(data, options) {
        const sharp = require("sharp");
        return sharp(data).jpeg(options).toBuffer();
    }
    convertWebPToPNG(data, options) {
        const sharp = require("sharp");
        return sharp(data).png(options).toBuffer();
    }
    convertJSONToXML(data, options) {
        const json = JSON.parse(data.toString("utf8"));
        const xml = this.jsonToXml(json);
        return Buffer.from(xml, "utf8");
    }
    convertXMLToJSON(data, options) {
        const xml = data.toString("utf8");
        const json = this.xmlToJson(xml);
        return Buffer.from(JSON.stringify(json), "utf8");
    }
    convertCSVToJSON(data, options) {
        const text = data.toString("utf8");
        const lines = text.split("\n");
        if (lines.length < 2) {
            throw new Error("Invalid CSV format");
        }
        const headers = lines[0].split(",").map(h => h.trim());
        const result = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map(v => v.trim());
            if (values.length === headers.length) {
                const obj = {};
                for (let j = 0; j < headers.length; j++) {
                    obj[headers[j]] = values[j];
                }
                result.push(obj);
            }
        }
        return Buffer.from(JSON.stringify(result), "utf8");
    }
    convertJSONToCSV(data, options) {
        const json = JSON.parse(data.toString("utf8"));
        if (!Array.isArray(json) || json.length === 0) {
            throw new Error("Invalid JSON array");
        }
        const headers = Object.keys(json[0]);
        let csv = headers.join(",") + "\n";
        for (const row of json) {
            const values = headers.map(h => {
                const value = row[h] || "";
                return typeof value === "string" ? `"${value}"` : value;
            });
            csv += values.join(",") + "\n";
        }
        return Buffer.from(csv, "utf8");
    }
    convertTextToBase64(data, options) {
        return Buffer.from(data.toString("base64"), "utf8");
    }
    convertBase64ToText(data, options) {
        return Buffer.from(data.toString("utf8"), "base64");
    }
    jsonToXml(json, root) {
        const key = root || "root";
        if (typeof json !== "object") {
            return `<${key}>${json}</${key}>`;
        }
        let xml = `<${key}>`;
        for (const [k, v] of Object.entries(json)) {
            if (Array.isArray(v)) {
                for (const item of v) {
                    xml += this.jsonToXml(item, k);
                }
            }
            else {
                xml += this.jsonToXml(v, k);
            }
        }
        xml += `</${key}>`;
        return xml;
    }
    xmlToJson(xml) {
        const parser = require("xml2js");
        let result = {};
        parser.parseString(xml, (err, res) => {
            if (err)
                throw err;
            result = res;
        });
        return result;
    }
    calculateHash(data) {
        const crypto = require("crypto");
        return crypto.createHash("sha256").update(data).digest("hex");
    }
    getConverters() {
        return Array.from(this.converters.keys());
    }
    removeConverter(name) {
        this.converters.delete(name);
    }
    clear() {
        this.converters.clear();
    }
}
exports.ConvertHandler = ConvertHandler;
//# sourceMappingURL=ConvertHandler.js.map