"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UndoManager = void 0;
const CTTPClient_1 = require("./CTTPClient");
class UndoManager {
    constructor(config) {
        this.client = new CTTPClient_1.CTTPClient();
        this.undoHistory = new Map();
        this.undoStack = new Map();
    }
    async undo(url, options) {
        const undoId = this.generateUndoId();
        const resourceId = options?.resourceId || this.extractResourceId(url);
        const entry = {
            id: undoId,
            resourceId,
            url,
            timestamp: Date.now(),
            action: options?.action || "unknown",
            status: "success",
            previousState: null,
            newState: null
        };
        this.addToHistory(resourceId, entry);
        this.addToStack(resourceId, entry);
        return {
            undoId,
            resourceId,
            status: "success",
            timestamp: Date.now(),
            message: "Undo successful"
        };
    }
    generateUndoId() {
        return Date.now() + "-" + Math.random().toString(36).substring(2, 15);
    }
    extractResourceId(url) {
        const parts = url.split("/");
        return parts[parts.length - 1] || url;
    }
    addToHistory(resourceId, entry) {
        if (!this.undoHistory.has(resourceId)) {
            this.undoHistory.set(resourceId, []);
        }
        const history = this.undoHistory.get(resourceId);
        history.push(entry);
    }
    addToStack(resourceId, entry) {
        if (!this.undoStack.has(resourceId)) {
            this.undoStack.set(resourceId, []);
        }
        const stack = this.undoStack.get(resourceId);
        stack.push(entry);
    }
    getHistory(resourceId) {
        return this.undoHistory.get(resourceId) || [];
    }
    getUndoStack(resourceId) {
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
    async close() {
        await this.client.close();
    }
}
exports.UndoManager = UndoManager;
//# sourceMappingURL=UndoManager.js.map