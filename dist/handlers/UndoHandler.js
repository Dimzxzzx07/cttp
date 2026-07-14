"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UndoHandler = void 0;
const CTTPResponse_1 = require("../core/CTTPResponse");
const HTTPVersion_1 = require("../core/HTTPVersion");
class UndoHandler {
    constructor() {
        this.undoHistory = new Map();
        this.undoStack = new Map();
    }
    async handle(request) {
        const body = request.getBody();
        const resourceId = body?.resourceId || this.extractResourceId(request.getURL());
        const options = body?.options || {};
        if (!resourceId) {
            return new CTTPResponse_1.CTTPResponse(400, "Bad Request", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), { error: "Missing resourceId" });
        }
        const previousState = this.getPreviousState(resourceId);
        if (!previousState) {
            return new CTTPResponse_1.CTTPResponse(404, "Not Found", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), { error: "No undoable action found" });
        }
        const newState = this.undoAction(previousState);
        const undoId = this.generateUndoId();
        const entry = {
            id: undoId,
            resourceId,
            timestamp: Date.now(),
            action: options.action || "unknown",
            status: "success",
            previousState,
            newState
        };
        this.addToHistory(resourceId, entry);
        this.addToStack(resourceId, entry);
        return new CTTPResponse_1.CTTPResponse(200, "OK", HTTPVersion_1.HTTPVersion.HTTP_1_1, new Map([["Content-Type", "application/json"]]), {
            undoId,
            resourceId,
            status: "success",
            timestamp: Date.now(),
            message: "Undo successful",
            previousState,
            newState
        });
    }
    extractResourceId(url) {
        const parts = url.split("/");
        return parts[parts.length - 1] || url;
    }
    generateUndoId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
    getPreviousState(resourceId) {
        if (!this.undoStack.has(resourceId)) {
            return null;
        }
        const stack = this.undoStack.get(resourceId);
        if (stack.length === 0) {
            return null;
        }
        return stack[stack.length - 1].newState;
    }
    undoAction(previousState) {
        return {
            ...previousState,
            _undoMeta: {
                timestamp: Date.now(),
                action: "undo"
            }
        };
    }
    addToHistory(resourceId, entry) {
        if (!this.undoHistory.has(resourceId)) {
            this.undoHistory.set(resourceId, []);
        }
        const history = this.undoHistory.get(resourceId);
        history.push(entry);
        if (history.length > 100) {
            history.shift();
        }
    }
    addToStack(resourceId, entry) {
        if (!this.undoStack.has(resourceId)) {
            this.undoStack.set(resourceId, []);
        }
        const stack = this.undoStack.get(resourceId);
        stack.push(entry);
        if (stack.length > 50) {
            stack.shift();
        }
    }
    getHistory(resourceId) {
        return this.undoHistory.get(resourceId) || [];
    }
    getStack(resourceId) {
        return this.undoStack.get(resourceId) || [];
    }
    clearHistory(resourceId) {
        this.undoHistory.delete(resourceId);
    }
    clearStack(resourceId) {
        this.undoStack.delete(resourceId);
    }
    clearAll() {
        this.undoHistory.clear();
        this.undoStack.clear();
    }
}
exports.UndoHandler = UndoHandler;
//# sourceMappingURL=UndoHandler.js.map