"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodInterceptor = void 0;
const HTTPMethod_1 = require("./HTTPMethod");
const Constants_1 = require("./Constants");
class MethodInterceptor {
    constructor(config) {
        this.config = config;
        this.constants = new Constants_1.Constants();
        this.customMethods = new Set([
            "LOGIN",
            "LOGOUT",
            "REFRESH",
            "SYNC",
            "MERGE",
            "STREAM",
            "UPLOAD",
            "CONVERT",
            "ARCHIVE",
            "AUDIT",
            "VERIFY",
            "PING",
            "NOTIFY",
            "UNDO"
        ]);
    }
    intercept(method, headers) {
        const methodStr = method.toString();
        if (this.isCustomMethod(methodStr)) {
            if (this.config.tunnelMode) {
                headers.set("X-HTTP-Method", methodStr);
                return HTTPMethod_1.HTTPMethod.POST;
            }
            if (this.config.extensionMode) {
                headers.set("X-HTTP-Method-Extension", methodStr);
                return HTTPMethod_1.HTTPMethod.GET;
            }
            return method;
        }
        return method;
    }
    isCustomMethod(method) {
        return this.customMethods.has(method);
    }
    addCustomMethod(method) {
        this.customMethods.add(method);
    }
    removeCustomMethod(method) {
        this.customMethods.delete(method);
    }
    getCustomMethods() {
        return Array.from(this.customMethods);
    }
    isMethodSupported(method) {
        return this.isCustomMethod(method) ||
            Object.values(HTTPMethod_1.HTTPMethod).includes(method);
    }
}
exports.MethodInterceptor = MethodInterceptor;
//# sourceMappingURL=MethodInterceptor.js.map