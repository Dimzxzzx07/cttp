"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const CTTPError_1 = require("../errors/CTTPError");
class ErrorHandler {
    constructor(logger) {
        this.logger = logger;
        this.retryableErrors = new Set([
            "ECONNRESET",
            "ECONNREFUSED",
            "ETIMEDOUT",
            "EPIPE",
            "ENOTFOUND"
        ]);
        this.maxRetries = 3;
        this.retryDelay = 1000;
    }
    handle(error) {
        if (error instanceof CTTPError_1.CTTPError) {
            this.logger.error(`CTTP Error: ${error.message}`, {
                status: error.getStatus(),
                code: error.getCode()
            });
        }
        else if (error instanceof Error) {
            this.logger.error(`Error: ${error.message}`, {
                stack: error.stack,
                name: error.name
            });
        }
        else {
            this.logger.error(`Unknown error: ${JSON.stringify(error)}`);
        }
    }
    isRetryable(error) {
        if (error instanceof CTTPError_1.CTTPError) {
            const status = error.getStatus();
            return status >= 500 || status === 429 || status === 408;
        }
        if (error instanceof Error) {
            const code = error.code;
            if (code && this.retryableErrors.has(code)) {
                return true;
            }
        }
        return false;
    }
    async retry(fn, maxRetries, delay) {
        const retries = maxRetries || this.maxRetries;
        const waitTime = delay || this.retryDelay;
        let lastError;
        for (let i = 0; i < retries; i++) {
            try {
                return await fn();
            }
            catch (error) {
                lastError = error;
                if (!this.isRetryable(error) || i === retries - 1) {
                    throw error;
                }
                this.logger.warn(`Retry attempt ${i + 1}/${retries} after error:`, error);
                await this.sleep(waitTime * Math.pow(2, i));
            }
        }
        throw lastError;
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    setMaxRetries(maxRetries) {
        this.maxRetries = maxRetries;
    }
    getMaxRetries() {
        return this.maxRetries;
    }
    setRetryDelay(delay) {
        this.retryDelay = delay;
    }
    getRetryDelay() {
        return this.retryDelay;
    }
    addRetryableError(code) {
        this.retryableErrors.add(code);
    }
    removeRetryableError(code) {
        this.retryableErrors.delete(code);
    }
}
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=ErrorHandler.js.map