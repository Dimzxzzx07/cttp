export namespace MethodTypes {
  export type StandardMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS" | "CONNECT" | "TRACE";
  export type CustomMethod = "LOGIN" | "LOGOUT" | "REFRESH" | "SYNC" | "MERGE" | "STREAM" | "UPLOAD" | "CONVERT" | "ARCHIVE" | "AUDIT" | "VERIFY" | "PING" | "NOTIFY" | "UNDO";
  export type HTTPMethod = StandardMethod | CustomMethod;
}