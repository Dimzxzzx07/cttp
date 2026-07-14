export class URLParser {
  public static parse(url: string): any {
    const result = {
      protocol: "",
      hostname: "",
      port: 0,
      pathname: "/",
      query: {} as Record<string, string>,
      hash: ""
    };
    
    try {
      const urlObj = new URL(url);
      result.protocol = urlObj.protocol.slice(0, -1);
      result.hostname = urlObj.hostname;
      result.port = parseInt(urlObj.port) || (result.protocol === "https" ? 443 : 80);
      result.pathname = urlObj.pathname;
      for (const [key, value] of urlObj.searchParams) {
        result.query[key] = value;
      }
      result.hash = urlObj.hash;
    } catch {
      const parts = url.match(/^([a-zA-Z]+):\/\/([^:\/]+)(?::(\d+))?(.*)$/);
      if (parts) {
        result.protocol = parts[1] || "http";
        result.hostname = parts[2] || "";
        result.port = parseInt(parts[3]) || (result.protocol === "https" ? 443 : 80);
        const pathParts = parts[4] || "/";
        const queryIndex = pathParts.indexOf("?");
        if (queryIndex !== -1) {
          result.pathname = pathParts.substring(0, queryIndex) || "/";
          const queryString = pathParts.substring(queryIndex + 1);
          for (const pair of queryString.split("&")) {
            const [key, value] = pair.split("=");
            if (key) {
              result.query[decodeURIComponent(key)] = value ? decodeURIComponent(value) : "";
            }
          }
        } else {
          result.pathname = pathParts || "/";
        }
        const hashIndex = result.pathname.indexOf("#");
        if (hashIndex !== -1) {
          result.hash = result.pathname.substring(hashIndex);
          result.pathname = result.pathname.substring(0, hashIndex);
        }
      }
    }
    
    return result;
  }

  public static build(parts: any): string {
    const protocol = parts.protocol || "http";
    const hostname = parts.hostname || "";
    const port = parts.port || (protocol === "https" ? 443 : 80);
    const pathname = parts.pathname || "/";
    const query = parts.query || {};
    const hash = parts.hash || "";
    
    let url = `${protocol}://${hostname}`;
    if ((protocol === "http" && port !== 80) || (protocol === "https" && port !== 443)) {
      url += `:${port}`;
    }
    url += pathname;
    
    const queryString = Object.keys(query)
      .filter(key => query[key] !== undefined && query[key] !== null)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
      .join("&");
    if (queryString) {
      url += `?${queryString}`;
    }
    
    if (hash) {
      url += hash;
    }
    
    return url;
  }
}