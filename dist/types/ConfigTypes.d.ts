export declare namespace ConfigTypes {
    interface ClientConfig {
        defaultTimeout?: number;
        defaultVersion?: string;
        enableTunnel?: boolean;
        logLevel?: string;
        poolConfig?: PoolConfig;
        dnsConfig?: DNSConfig;
        tlsConfig?: TLSConfig;
        quicConfig?: QUICConfig;
        tunnelConfig?: TunnelConfig;
        interceptorConfig?: InterceptorConfig;
        uploadConfig?: UploadConfig;
        syncConfig?: SyncConfig;
        mergeConfig?: MergeConfig;
        auditConfig?: AuditConfig;
        undoConfig?: UndoConfig;
        verifyConfig?: VerifyConfig;
        healthConfig?: HealthConfig;
        notifyConfig?: NotifyConfig;
        tokenConfig?: TokenConfig;
        memoryConfig?: MemoryConfig;
        zeroConfig?: ZeroConfig;
        bufferConfig?: BufferConfig;
        workerConfig?: WorkerConfig;
        schedulerConfig?: SchedulerConfig;
        registryConfig?: RegistryConfig;
    }
    interface PoolConfig {
        maxConnections?: number;
        idleTimeout?: number;
        connectionTimeout?: number;
    }
    interface DNSConfig {
        cacheSize?: number;
        ttl?: number;
        timeout?: number;
    }
    interface TLSConfig {
        rejectUnauthorized?: boolean;
        minVersion?: string;
        maxVersion?: string;
        secureProtocol?: string;
        certPath?: string;
        keyPath?: string;
    }
    interface QUICConfig {
        alpn?: string[];
        maxStreams?: number;
    }
    interface TunnelConfig {
        encrypt?: boolean;
        encryptionKey?: string;
        poolConfig?: PoolConfig;
        tlsConfig?: TLSConfig;
    }
    interface InterceptorConfig {
        tunnelMode?: boolean;
        extensionMode?: boolean;
    }
    interface UploadConfig {
        chunkSize?: number;
        parallelChunks?: number;
    }
    interface SyncConfig {
        defaultStrategy?: string;
    }
    interface MergeConfig {
        defaultStrategy?: string;
    }
    interface AuditConfig {
        maxEntries?: number;
    }
    interface UndoConfig {
        maxHistory?: number;
        maxStack?: number;
    }
    interface VerifyConfig {
        cacheSize?: number;
    }
    interface HealthConfig {
        pingTimeout?: number;
    }
    interface NotifyConfig {
        timeout?: number;
        retryOnFailure?: boolean;
        maxRetries?: number;
        retryDelay?: number;
        broadcastUrls?: string[];
    }
    interface TokenConfig {
        refreshUrl?: string;
    }
    interface MemoryConfig {
        memoryLimit?: number;
    }
    interface ZeroConfig {
        enableZeroing?: boolean;
    }
    interface BufferConfig {
        maxPoolSize?: number;
    }
    interface WorkerConfig {
        taskTimeout?: number;
        bufferConfig?: BufferConfig;
    }
    interface SchedulerConfig {
        maxTasks?: number;
        maxConcurrent?: number;
        enablePriorities?: boolean;
    }
    interface RegistryConfig {
        allowOverride?: boolean;
        strictMode?: boolean;
    }
    interface ClientState {
        connected: boolean;
        authenticated: boolean;
        sessionId: string | null;
        lastRequestTime: number;
        requestCount: number;
        errorCount: number;
        bytesTransferred: number;
    }
}
//# sourceMappingURL=ConfigTypes.d.ts.map