import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
import { CTTPResponse } from "../core/CTTPResponse";
import { HTTPVersion } from "../core/HTTPVersion";

export class ConvertHandler implements IMethodHandler {
  private converters: Map<string, (data: Buffer, options?: any) => Buffer>;

  constructor() {
    this.converters = new Map();
    this.registerDefaultConverters();
  }

  private registerDefaultConverters(): void {
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

  public register(name: string, converter: (data: Buffer, options?: any) => Buffer): void {
    this.converters.set(name, converter);
  }

  public async handle(request: IHTTPRequest): Promise<IHTTPResponse> {
    const body = request.getBody();
    const file = body?.file;
    const targetFormat = body?.targetFormat;
    const options = body?.options || {};

    if (!file) {
      return new CTTPResponse(
        400,
        "Bad Request",
        HTTPVersion.HTTP_1_1,
        new Map([["Content-Type", "application/json"]]),
        { error: "Missing file" }
      );
    }

    if (!targetFormat) {
      return new CTTPResponse(
        400,
        "Bad Request",
        HTTPVersion.HTTP_1_1,
        new Map([["Content-Type", "application/json"]]),
        { error: "Missing target format" }
      );
    }

    const fileBuffer = Buffer.isBuffer(file) ? file : Buffer.from(file);
    const sourceFormat = this.detectFormat(fileBuffer);
    const converterKey = `${sourceFormat}-to-${targetFormat}`;

    const converter = this.converters.get(converterKey);
    if (!converter) {
      return new CTTPResponse(
        400,
        "Bad Request",
        HTTPVersion.HTTP_1_1,
        new Map([["Content-Type", "application/json"]]),
        { error: `No converter found for ${sourceFormat} to ${targetFormat}` }
      );
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

      return new CTTPResponse(
        200,
        "OK",
        HTTPVersion.HTTP_1_1,
        new Map([["Content-Type", "application/json"]]),
        result
      );
    } catch (error) {
      return new CTTPResponse(
        500,
        "Internal Server Error",
        HTTPVersion.HTTP_1_1,
        new Map([["Content-Type", "application/json"]]),
        { error: "Conversion failed", details: (error as Error).message }
      );
    }
  }

  private detectFormat(buffer: Buffer): string {
    const signature = buffer.subarray(0, 8);
    const hex = signature.toString("hex");

    if (hex.startsWith("89504e47")) return "png";
    if (hex.startsWith("ffd8ff")) return "jpg";
    if (hex.startsWith("52494646") && buffer.subarray(8, 12).toString("hex") === "57454250") return "webp";
    if (buffer.toString("utf8", 0, 5) === "<?xml") return "xml";
    if (buffer.toString("utf8", 0, 1) === "{") return "json";
    if (buffer.toString("utf8", 0, 1) === "[") return "json";

    const text = buffer.toString("utf8", 0, 100);
    if (text.includes(",")) return "csv";

    return "text";
  }

  private convertPNGToWebP(data: Buffer, options?: any): Buffer {
    const sharp = require("sharp");
    return sharp(data).webp(options).toBuffer();
  }

  private convertJPGToWebP(data: Buffer, options?: any): Buffer {
    const sharp = require("sharp");
    return sharp(data).webp(options).toBuffer();
  }

  private convertPNGToJPG(data: Buffer, options?: any): Buffer {
    const sharp = require("sharp");
    return sharp(data).jpeg(options).toBuffer();
  }

  private convertWebPToPNG(data: Buffer, options?: any): Buffer {
    const sharp = require("sharp");
    return sharp(data).png(options).toBuffer();
  }

  private convertJSONToXML(data: Buffer, options?: any): Buffer {
    const json = JSON.parse(data.toString("utf8"));
    const xml = this.jsonToXml(json);
    return Buffer.from(xml, "utf8");
  }

  private convertXMLToJSON(data: Buffer, options?: any): Buffer {
    const xml = data.toString("utf8");
    const json = this.xmlToJson(xml);
    return Buffer.from(JSON.stringify(json), "utf8");
  }

  private convertCSVToJSON(data: Buffer, options?: any): Buffer {
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
        const obj: any = {};
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = values[j];
        }
        result.push(obj);
      }
    }

    return Buffer.from(JSON.stringify(result), "utf8");
  }

  private convertJSONToCSV(data: Buffer, options?: any): Buffer {
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

  private convertTextToBase64(data: Buffer, options?: any): Buffer {
    return Buffer.from(data.toString("base64"), "utf8");
  }

  private convertBase64ToText(data: Buffer, options?: any): Buffer {
    return Buffer.from(data.toString("utf8"), "base64");
  }

  private jsonToXml(json: any, root?: string): string {
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
      } else {
        xml += this.jsonToXml(v, k);
      }
    }
    xml += `</${key}>`;
    return xml;
  }

  private xmlToJson(xml: string): any {
    const parser = require("xml2js");
    let result = {};
    parser.parseString(xml, (err: any, res: any) => {
      if (err) throw err;
      result = res;
    });
    return result;
  }

  private calculateHash(data: Buffer): string {
    const crypto = require("crypto");
    return crypto.createHash("sha256").update(data).digest("hex");
  }

  public getConverters(): string[] {
    return Array.from(this.converters.keys());
  }

  public removeConverter(name: string): void {
    this.converters.delete(name);
  }

  public clear(): void {
    this.converters.clear();
  }
}