export class XMLParser {
  public parse(data: string): any {
    const xml2js = require("xml2js");
    const parser = new xml2js.Parser({ explicitArray: false });
    let result: any = {};
    parser.parseString(data, (err: any, res: any) => {
      if (err) throw err;
      result = res;
    });
    return result;
  }

  public stringify(data: any): string {
    const xml2js = require("xml2js");
    const builder = new xml2js.Builder();
    return builder.buildObject(data);
  }

  public isValid(data: string): boolean {
    try {
      this.parse(data);
      return true;
    } catch {
      return false;
    }
  }

  public parseSafe(data: string, fallback?: any): any {
    try {
      return this.parse(data);
    } catch {
      return fallback || null;
    }
  }

  public stringifySafe(data: any, fallback?: string): string {
    try {
      return this.stringify(data);
    } catch {
      return fallback || "";
    }
  }
}
