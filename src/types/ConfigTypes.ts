export namespace ConfigTypes {
  export interface ClientConfig {
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

  export interface PoolConfig {
    maxConnections?: number;
    idleTimeout?: number;
    connectionTimeout?: number;
  }

  export interface DNSConfig {
    cacheSize?: number;
    ttl?: number;
    timeout?: number;
  }

  export interface TLSConfig {
    rejectUnauthorized?: boolean;
    minVersion?: string;
    maxVersion?: string;
    secureProtocol?: string;
    certPath?: string;
    keyPath?: string;
  }

  export interface QUICConfig {
    alpn?: string[];
    maxStreams?: number;
  }

  export interface TunnelConfig {
    encrypt?: boolean;
    encryptionKey?: string;
    poolConfig?: PoolConfig;
    tlsConfig?: TLSConfig;
  }

  export interface InterceptorConfig {
    tunnelMode?: boolean;
    extensionMode?: boolean;
  }

  export interface UploadConfig {
    chunkSize?: number;
    parallelChunks?: number;
  }

  export interface SyncConfig {
    defaultStrategy?: string;
  }

  export interface MergeConfig {
    defaultStrategy?: string;
  }

  export interface AuditConfig {
    maxEntries?: number;
  }

  export interface UndoConfig {
    maxHistory?: number;
    maxStack?: number;
  }

  export interface VerifyConfig {
    cacheSize?: number;
  }

  export interface HealthConfig {
    pingTimeout?: number;
  }

  export interface NotifyConfig {
    timeout?: number;
    retryOnFailure?: boolean;
    maxRetries?: number;
    retryDelay?: number;
    broadcastUrls?: string[];
  }

  export interface TokenConfig {
    refreshUrl?: string;
  }

  export interface MemoryConfig {
    memoryLimit?: number;
  }

  export interface ZeroConfig {
    enableZeroing?: boolean;
  }

  export interface BufferConfig {
    maxPoolSize?: number;
  }

  export interface WorkerConfig {
    taskTimeout?: number;
    bufferConfig?: BufferConfig;
  }

  export interface SchedulerConfig {
    maxTasks?: number;
    maxConcurrent?: number;
    enablePriorities?: boolean;
  }

  export interface RegistryConfig {
    allowOverride?: boolean;
    strictMode?: boolean;
  }

  export interface ClientState {
    connected: boolean;
    authenticated: boolean;
    sessionId: string | null;
    lastRequestTime: number;
    requestCount: number;
    errorCount: number;
    bytesTransferred: number;
  }
}