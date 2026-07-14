export namespace CommonTypes {
  export type ID = string | number;
  export type Timestamp = number;
  export type ISOString = string;
  export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
  export interface JSONObject {
    [key: string]: JSONValue;
  }
  export type JSONArray = JSONValue[];

  export interface ErrorResponse {
    error: string;
    message: string;
    code?: string;
    details?: any;
    timestamp: number;
  }

  export interface SuccessResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    timestamp: number;
  }

  export interface PaginationOptions {
    page?: number;
    limit?: number;
    offset?: number;
    sort?: string;
    order?: "asc" | "desc";
  }

  export interface PaginationResponse<T = any> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }

  export interface HealthCheckResponse {
    status: "healthy" | "degraded" | "unhealthy";
    timestamp: number;
    uptime: number;
    checks: Record<string, any>;
  }

  export interface VersionInfo {
    version: string;
    build: string;
    commit: string;
    timestamp: number;
    environment: string;
  }
}