export namespace HeaderTypes {
  export type StandardHeaders =
    | "host"
    | "user-agent"
    | "accept"
    | "accept-encoding"
    | "accept-language"
    | "content-type"
    | "content-length"
    | "cache-control"
    | "authorization"
    | "cookie"
    | "referer"
    | "origin"
    | "connection"
    | "upgrade"
    | "etag"
    | "if-match"
    | "if-none-match"
    | "range"
    | "x-request-id"
    | "x-forwarded-for"
    | "x-real-ip"
    | "x-correlation-id";

  export type CustomHeaders = string;

  export type Header = StandardHeaders | CustomHeaders;
}