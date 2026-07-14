import { IMethodHandler } from "../interfaces/IMethodHandler";
import { IHTTPRequest } from "../interfaces/IHTTPRequest";
import { IHTTPResponse } from "../interfaces/IHTTPResponse";
export declare class StreamHandler implements IMethodHandler {
    private streams;
    private eventListeners;
    constructor();
    handle(request: IHTTPRequest): Promise<IHTTPResponse>;
    private generateStreamId;
    private encodeData;
    private emitEvent;
    on(streamId: string, event: string, callback: Function): void;
    off(streamId: string, event: string, callback: Function): void;
    getStream(streamId: string): any;
    getStreams(): any[];
    closeStream(streamId: string): void;
    closeAll(): void;
    getStreamData(streamId: string): any[];
    clearStreamData(streamId: string): void;
}
//# sourceMappingURL=StreamHandler.d.ts.map