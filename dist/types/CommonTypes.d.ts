export declare namespace CommonTypes {
    type ID = string | number;
    type Timestamp = number;
    type ISOString = string;
    type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
    interface JSONObject {
        [key: string]: JSONValue;
    }
    type JSONArray = JSONValue[];
    interface ErrorResponse {
        error: string;
        message: string;
        code?: string;
        details?: any;
        timestamp: number;
    }
    interface SuccessResponse<T = any> {
        success: boolean;
        data?: T;
        message?: string;
        timestamp: number;
    }
    interface PaginationOptions {
        page?: number;
        limit?: number;
        offset?: number;
        sort?: string;
        order?: "asc" | "desc";
    }
    interface PaginationResponse<T = any> {
        items: T[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
    interface HealthCheckResponse {
        status: "healthy" | "degraded" | "unhealthy";
        timestamp: number;
        uptime: number;
        checks: Record<string, any>;
    }
    interface VersionInfo {
        version: string;
        build: string;
        commit: string;
        timestamp: number;
        environment: string;
    }
}
//# sourceMappingURL=CommonTypes.d.ts.map