/// <reference types="node" />
/// <reference types="node" />
import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
export declare class ConvertHandler implements IMethodHandler {
    private converters;
    constructor();
    private registerDefaultConverters;
    register(name: string, converter: (data: Buffer, options?: any) => Buffer): void;
    handle(request: IHTTPRequest): Promise<IHTTPResponse>;
    private detectFormat;
    private convertPNGToWebP;
    private convertJPGToWebP;
    private convertPNGToJPG;
    private convertWebPToPNG;
    private convertJSONToXML;
    private convertXMLToJSON;
    private convertCSVToJSON;
    private convertJSONToCSV;
    private convertTextToBase64;
    private convertBase64ToText;
    private jsonToXml;
    private xmlToJson;
    private calculateHash;
    getConverters(): string[];
    removeConverter(name: string): void;
    clear(): void;
}
//# sourceMappingURL=ConvertHandler.d.ts.map