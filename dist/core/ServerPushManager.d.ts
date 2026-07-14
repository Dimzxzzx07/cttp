export declare class ServerPushManager {
    private pushPromises;
    private pushCache;
    private enabled;
    private maxConcurrentPushes;
    private activePushes;
    constructor();
    push(streamId: number, url: string, headers: Map<string, string>): Promise<void>;
    private executePush;
    private fetchResource;
    private waitForPushSlot;
    private generatePushId;
    enable(): void;
    disable(): void;
    isEnabled(): boolean;
    setMaxConcurrentPushes(max: number): void;
    getMaxConcurrentPushes(): number;
    getActivePushes(): number;
    getCacheSize(): number;
    clearCache(): void;
    getPushPromises(): number;
}
//# sourceMappingURL=ServerPushManager.d.ts.map