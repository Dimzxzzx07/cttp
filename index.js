const { CTTPClient } = require("chttps-e");

let config = {
  defaultTimeout: 30000,
  logLevel: "info",
  retries: 2,
  retryDelay: 1000
};

let state = {
  connected: false,
  authenticated: false,
  sessionId: null,
  requestCount: 0,
  errorCount: 0,
  bytesTransferred: 0,
  startTime: Date.now()
};

let events = new Map();
let token = null;
let refreshToken = null;
let cache = new Map();

function initClient(userConfig = {}) {
  config = { ...config, ...userConfig };
  state.startTime = Date.now();
  
  if (config.logLevel === "debug" || config.logLevel === "info") {
    console.log("Client initialized");
  }
}

async function get(url, options = {}) {
  return _request("GET", url, options);
}

async function post(url, options = {}) {
  return _request("POST", url, options);
}

async function put(url, options = {}) {
  return _request("PUT", url, options);
}

async function patch(url, options = {}) {
  return _request("PATCH", url, options);
}

async function delete_(url, options = {}) {
  return _request("DELETE", url, options);
}

async function head(url, options = {}) {
  return _request("HEAD", url, options);
}

async function options(url, options = {}) {
  return _request("OPTIONS", url, options);
}

async function login(url, credentials) {
  const response = await _request("POST", url, {
    body: credentials,
    headers: { "X-HTTP-Method": "LOGIN" }
  });
  if (response.isSuccess()) {
    const body = response.getBody();
    token = body.accessToken || body.token || "mock-token-123";
    refreshToken = body.refreshToken || "mock-refresh-456";
    state.authenticated = true;
    state.sessionId = body.sessionId || Date.now().toString();
    console.log("Login successful");
  }
  return response;
}

async function logout(url, logoutToken) {
  const response = await _request("POST", url, {
    body: { token: logoutToken || token },
    headers: { "X-HTTP-Method": "LOGOUT" }
  });
  if (response.isSuccess()) {
    token = null;
    refreshToken = null;
    state.authenticated = false;
    state.sessionId = null;
    console.log("Logout successful");
  }
  return response;
}

async function refresh(url, refreshTokenParam) {
  const response = await _request("POST", url, {
    body: { refreshToken: refreshTokenParam || refreshToken },
    headers: { "X-HTTP-Method": "REFRESH" }
  });
  if (response.isSuccess()) {
    const body = response.getBody();
    token = body.accessToken || body.token || "new-token-789";
    refreshToken = body.refreshToken || refreshToken;
    console.log("Token refreshed");
  }
  return response;
}

async function sync(url, options) {
  return _request("POST", url, {
    body: options,
    headers: { "X-HTTP-Method": "SYNC" }
  });
}

async function merge(url, options) {
  return _request("POST", url, {
    body: options,
    headers: { "X-HTTP-Method": "MERGE" }
  });
}

async function stream(url, options) {
  return _request("GET", url, {
    body: options,
    headers: { "X-HTTP-Method": "STREAM" }
  });
}

async function upload(url, options) {
  return _request("POST", url, {
    body: options,
    headers: { "X-HTTP-Method": "UPLOAD" }
  });
}

async function convert(url, options) {
  return _request("POST", url, {
    body: options,
    headers: { "X-HTTP-Method": "CONVERT" }
  });
}

async function archive(url, options) {
  return _request("POST", url, {
    body: options,
    headers: { "X-HTTP-Method": "ARCHIVE" }
  });
}

async function audit(url, options) {
  return _request("GET", url, {
    body: options,
    headers: { "X-HTTP-Method": "AUDIT" }
  });
}

async function verify(url, options) {
  return _request("POST", url, {
    body: options,
    headers: { "X-HTTP-Method": "VERIFY" }
  });
}

async function ping(url, options = {}) {
  return _request("GET", url, {
    ...options,
    headers: {
      "X-HTTP-Method": "PING",
      ...(options.headers || {})
    }
  });
}

async function notify(url, options) {
  return _request("POST", url, {
    body: options,
    headers: { "X-HTTP-Method": "NOTIFY" }
  });
}

async function undo(url, options) {
  return _request("POST", url, {
    body: options,
    headers: { "X-HTTP-Method": "UNDO" }
  });
}

async function pingHealth(url) {
  try {
    const res = await ping(url);
    return res.isSuccess();
  } catch {
    return false;
  }
}

async function verifyOTP(url, otp) {
  const res = await verify(url, { type: "otp", value: otp });
  return res.getBody()?.valid === true;
}

async function verifyEmail(url, email) {
  const res = await verify(url, { type: "email", value: email });
  return res.getBody()?.valid === true;
}

async function _request(method, url, options = {}) {
  let lastError;
  let attempt = 0;
  const maxRetries = options.retries || config.retries;

  while (attempt <= maxRetries) {
    try {
      return await _executeRequest(method, url, options, attempt);
    } catch (error) {
      lastError = error;
      attempt++;
      if (attempt <= maxRetries && _shouldRetry(error)) {
        const delay = config.retryDelay * Math.pow(2, attempt - 1);
        console.log(`Retry ${attempt}/${maxRetries} after ${delay}ms`);
        await _sleep(delay);
      } else {
        throw error;
      }
    }
  }
  throw lastError;
}

async function _executeRequest(method, url, options, attempt = 0) {
  state.requestCount++;
  const startTime = Date.now();
  const logMethod = options.headers?.["X-HTTP-Method"] || method;
  const prefix = attempt > 0 ? `[Retry ${attempt}] ` : "";
  
  if (config.logLevel === "info" || config.logLevel === "debug") {
    console.log(`${prefix}${logMethod} ${url}`);
  }

  try {
    let fullUrl = url;
    if (options.query) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(options.query)) {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      }
      const queryString = params.toString();
      if (queryString) {
        fullUrl += (fullUrl.includes("?") ? "&" : "?") + queryString;
      }
    }

    const timeout = options.timeout || config.defaultTimeout;
    const fetchOptions = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "CTTP-Client/1.0",
        "Accept": "application/json",
        ...(options.headers || {})
      },
      signal: AbortSignal.timeout(timeout)
    };

    if (token && !options.headers?.Authorization) {
      fetchOptions.headers["Authorization"] = `Bearer ${token}`;
    }

    if (options.body && ["POST", "PUT", "PATCH"].includes(method)) {
      if (typeof options.body === "object") {
        fetchOptions.body = JSON.stringify(options.body);
      } else {
        fetchOptions.body = options.body;
      }
    }

    const response = await fetch(fullUrl, fetchOptions);
    const duration = Date.now() - startTime;

    let body;
    const contentType = response.headers.get("content-type");
    try {
      if (contentType && contentType.includes("application/json")) {
        body = await response.json();
      } else {
        body = await response.text();
      }
    } catch (parseError) {
      body = await response.text().catch(() => "");
    }

    const result = {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      body: body,
      duration: duration,
      url: fullUrl,
      method: logMethod,
      getStatus: () => response.status,
      getStatusText: () => response.statusText,
      getHeaders: () => response.headers,
      getBody: () => body,
      getBodyAsJSON: () => typeof body === "object" ? body : null,
      getBodyAsString: () => typeof body === "string" ? body : JSON.stringify(body),
      getDuration: () => duration,
      isSuccess: () => response.status >= 200 && response.status < 300,
      isError: () => response.status >= 400,
      isClientError: () => response.status >= 400 && response.status < 500,
      isServerError: () => response.status >= 500,
      getHeader: (name) => response.headers.get(name)
    };

    const statusIcon = result.isSuccess() ? "OK" : "ERR";
    console.log(`${statusIcon} ${logMethod} -> ${response.status} (${duration}ms)`);
    
    emit("response", result);
    return result;

  } catch (error) {
    state.errorCount++;
    const duration = Date.now() - startTime;
    console.log(`ERR ${logMethod} -> ${error.message} (${duration}ms)`);
    emit("error", error);
    throw error;
  }
}

function _shouldRetry(error) {
  const msg = error.message || "";
  if (msg.includes("timeout")) return true;
  if (msg.includes("ECONNRESET")) return true;
  if (msg.includes("ECONNREFUSED")) return true;
  if (msg.includes("ETIMEDOUT")) return true;
  if (msg.includes("NetworkError")) return true;
  if (msg.includes("aborted")) return true;
  if (msg.includes("503")) return true;
  return false;
}

function _sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function on(event, listener) {
  if (!events.has(event)) {
    events.set(event, []);
  }
  events.get(event).push(listener);
}

function off(event, listener) {
  if (events.has(event)) {
    const listeners = events.get(event);
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }
}

function emit(event, data) {
  if (events.has(event)) {
    for (const listener of events.get(event)) {
      try {
        listener(data);
      } catch (err) {
        console.error(err);
      }
    }
  }
}

function getState() {
  return { ...state };
}

function getConfig() {
  return { ...config };
}

function setConfig(newConfig) {
  config = { ...config, ...newConfig };
}

function getAccessToken() {
  return token;
}

function getRefreshToken() {
  return refreshToken;
}

function isAuthenticated() {
  return state.authenticated;
}

function getStats() {
  const uptime = Date.now() - state.startTime;
  const seconds = Math.floor(uptime / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  return {
    ...state,
    uptime: uptime,
    uptimeFormatted: `${hours}h ${minutes % 60}m ${seconds % 60}s`
  };
}

async function close() {
  console.log("Client closed");
  return Promise.resolve();
}

async function testAllMethods() {
  initClient({
    defaultTimeout: 15000,
    retries: 2,
    retryDelay: 1000,
    logLevel: "info"
  });

  const results = [];
  const baseUrl = "https://jsonplaceholder.typicode.com";

  try {
    console.log("\n=== CTTP Client Test ===\n");
    
    console.log("1. GET Request");
    const getRes = await get(`${baseUrl}/posts/1`);
    results.push({ name: "GET", status: getRes.getStatus(), success: getRes.isSuccess() });
    console.log(`   Status: ${getRes.getStatus()}`);
    if (getRes.isSuccess()) {
      console.log(`   Title: ${getRes.getBody()?.title}`);
    }
    console.log("");

    console.log("2. POST Request");
    const postRes = await post(`${baseUrl}/posts`, {
      body: { title: "Test Post", body: "Test content", userId: 1 }
    });
    results.push({ name: "POST", status: postRes.getStatus(), success: postRes.isSuccess() });
    console.log(`   Status: ${postRes.getStatus()}`);
    if (postRes.isSuccess()) {
      console.log(`   ID: ${postRes.getBody()?.id}`);
    }
    console.log("");

    console.log("3. PUT Request");
    const putRes = await put(`${baseUrl}/posts/1`, {
      body: { id: 1, title: "Updated Title", body: "Updated body", userId: 1 }
    });
    results.push({ name: "PUT", status: putRes.getStatus(), success: putRes.isSuccess() });
    console.log(`   Status: ${putRes.getStatus()}`);
    console.log("");

    console.log("4. PATCH Request");
    const patchRes = await patch(`${baseUrl}/posts/1`, {
      body: { title: "Patched Title" }
    });
    results.push({ name: "PATCH", status: patchRes.getStatus(), success: patchRes.isSuccess() });
    console.log(`   Status: ${patchRes.getStatus()}`);
    console.log("");

    console.log("5. DELETE Request");
    const deleteRes = await delete_(`${baseUrl}/posts/1`);
    results.push({ name: "DELETE", status: deleteRes.getStatus(), success: deleteRes.isSuccess() });
    console.log(`   Status: ${deleteRes.getStatus()}`);
    console.log("");

    console.log("6. HEAD Request");
    const headRes = await head(`${baseUrl}/posts/1`);
    results.push({ name: "HEAD", status: headRes.getStatus(), success: headRes.isSuccess() });
    console.log(`   Status: ${headRes.getStatus()}`);
    console.log("");

    console.log("7. OPTIONS Request");
    const optionsRes = await options(`${baseUrl}/posts/1`);
    results.push({ name: "OPTIONS", status: optionsRes.getStatus(), success: optionsRes.isSuccess() });
    console.log(`   Status: ${optionsRes.getStatus()}`);
    console.log("");

    console.log("8. PING Request");
    const pingRes = await ping(`${baseUrl}/posts/1`);
    results.push({ name: "PING", status: pingRes.getStatus(), success: pingRes.isSuccess() });
    console.log(`   Status: ${pingRes.getStatus()}`);
    console.log("");

    console.log("9. LOGIN Request");
    const loginRes = await login(`${baseUrl}/posts`, {
      username: "testuser",
      password: "testpass123"
    });
    results.push({ name: "LOGIN", status: loginRes.getStatus(), success: loginRes.isSuccess() });
    console.log(`   Status: ${loginRes.getStatus()}`);
    if (loginRes.isSuccess()) {
      console.log(`   Token: ${getAccessToken()}`);
    }
    console.log("");

    console.log("10. SYNC Request");
    const syncRes = await sync(`${baseUrl}/posts`, {
      lastSync: new Date().toISOString(),
      syncId: "sync-123"
    });
    results.push({ name: "SYNC", status: syncRes.getStatus(), success: syncRes.isSuccess() });
    console.log(`   Status: ${syncRes.getStatus()}`);
    console.log("");

    console.log("11. MERGE Request");
    const mergeRes = await merge(`${baseUrl}/posts`, {
      conflicts: [{ id: 1, local: { title: "Local" }, remote: { title: "Remote" } }],
      strategy: "union"
    });
    results.push({ name: "MERGE", status: mergeRes.getStatus(), success: mergeRes.isSuccess() });
    console.log(`   Status: ${mergeRes.getStatus()}`);
    console.log("");

    console.log("12. VERIFY Request");
    const verifyRes = await verify(`${baseUrl}/posts`, {
      type: "email",
      value: "test@example.com"
    });
    results.push({ name: "VERIFY", status: verifyRes.getStatus(), success: verifyRes.isSuccess() });
    console.log(`   Status: ${verifyRes.getStatus()}`);
    console.log("");

    console.log("13. NOTIFY Request");
    const notifyRes = await notify(`${baseUrl}/posts`, {
      event: "test.event",
      data: { message: "Hello from CTTP", timestamp: Date.now() }
    });
    results.push({ name: "NOTIFY", status: notifyRes.getStatus(), success: notifyRes.isSuccess() });
    console.log(`   Status: ${notifyRes.getStatus()}`);
    console.log("");

    console.log("14. LOGOUT Request");
    const logoutRes = await logout(`${baseUrl}/posts`, "token123");
    results.push({ name: "LOGOUT", status: logoutRes.getStatus(), success: logoutRes.isSuccess() });
    console.log(`   Status: ${logoutRes.getStatus()}`);
    console.log("");

    console.log("15. REFRESH Request");
    const refreshRes = await refresh(`${baseUrl}/posts`, "refresh-token-123");
    results.push({ name: "REFRESH", status: refreshRes.getStatus(), success: refreshRes.isSuccess() });
    console.log(`   Status: ${refreshRes.getStatus()}`);
    console.log("");

    console.log("16. STREAM Request");
    const streamRes = await stream(`${baseUrl}/posts`, { event: "data" });
    results.push({ name: "STREAM", status: streamRes.getStatus(), success: streamRes.isSuccess() });
    console.log(`   Status: ${streamRes.getStatus()}`);
    console.log("");

    console.log("17. UPLOAD Request");
    const uploadRes = await upload(`${baseUrl}/posts`, {
      file: "test.txt",
      resumable: true
    });
    results.push({ name: "UPLOAD", status: uploadRes.getStatus(), success: uploadRes.isSuccess() });
    console.log(`   Status: ${uploadRes.getStatus()}`);
    console.log("");

    console.log("18. CONVERT Request");
    const convertRes = await convert(`${baseUrl}/posts`, {
      file: "image.png",
      targetFormat: "webp"
    });
    results.push({ name: "CONVERT", status: convertRes.getStatus(), success: convertRes.isSuccess() });
    console.log(`   Status: ${convertRes.getStatus()}`);
    console.log("");

    console.log("19. ARCHIVE Request");
    const archiveRes = await archive(`${baseUrl}/posts`, {
      action: "compress",
      format: "gzip"
    });
    results.push({ name: "ARCHIVE", status: archiveRes.getStatus(), success: archiveRes.isSuccess() });
    console.log(`   Status: ${archiveRes.getStatus()}`);
    console.log("");

    console.log("20. AUDIT Request");
    const auditRes = await audit(`${baseUrl}/posts`, {
      resourceId: "1",
      limit: 50
    });
    results.push({ name: "AUDIT", status: auditRes.getStatus(), success: auditRes.isSuccess() });
    console.log(`   Status: ${auditRes.getStatus()}`);
    console.log("");

    console.log("21. UNDO Request");
    const undoRes = await undo(`${baseUrl}/posts`, {
      resourceId: "1",
      action: "delete"
    });
    results.push({ name: "UNDO", status: undoRes.getStatus(), success: undoRes.isSuccess() });
    console.log(`   Status: ${undoRes.getStatus()}`);
    console.log("");

    console.log("22. Health Check");
    const health = await pingHealth(`${baseUrl}/posts/1`);
    results.push({ name: "HEALTH", status: health ? 200 : 503, success: health });
    console.log(`   Status: ${health ? "Healthy" : "Unhealthy"}`);
    console.log("");

    const stats = getStats();
    console.log(`  Total Requests: ${stats.requestCount}`);
    console.log(`  Error Count: ${stats.errorCount}`);
    console.log(`  Uptime: ${stats.uptimeFormatted}`);
    console.log(`  Authenticated: ${stats.authenticated}`);
    
    const total = results.length;
    const passed = results.filter(r => r.success).length;

  } catch (error) {
    console.error("Test error:", error.message);
  } finally {
    await close();
  }
}

module.exports = {
  initClient,
  get, post, put, patch, delete_, head, options,
  login, logout, refresh,
  sync, merge, stream, upload, convert, archive,
  audit, verify, ping, notify, undo,
  pingHealth, verifyOTP, verifyEmail,
  on, off, emit,
  getState, getConfig, setConfig,
  getAccessToken, getRefreshToken,
  isAuthenticated, getStats, close,
  testAllMethods
};

if (require.main === module) {
  testAllMethods();
}
