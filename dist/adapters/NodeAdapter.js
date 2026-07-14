"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeAdapter = void 0;
class NodeAdapter {
    constructor() {
        this.http = require("http");
        this.https = require("https");
        this.net = require("net");
        this.tls = require("tls");
        this.dns = require("dns");
        this.crypto = require("crypto");
        this.zlib = require("zlib");
        this.stream = require("stream");
        this.events = require("events");
        this.fs = require("fs");
        this.path = require("path");
        this.os = require("os");
        this.util = require("util");
        this.url = require("url");
        this.querystring = require("querystring");
    }
    getHTTP() {
        return this.http;
    }
    getHTTPS() {
        return this.https;
    }
    getNet() {
        return this.net;
    }
    getTLS() {
        return this.tls;
    }
    getDNS() {
        return this.dns;
    }
    getCrypto() {
        return this.crypto;
    }
    getZlib() {
        return this.zlib;
    }
    getStream() {
        return this.stream;
    }
    getEvents() {
        return this.events;
    }
    getFS() {
        return this.fs;
    }
    getPath() {
        return this.path;
    }
    getOS() {
        return this.os;
    }
    getUtil() {
        return this.util;
    }
    getURL() {
        return this.url;
    }
    getQuerystring() {
        return this.querystring;
    }
}
exports.NodeAdapter = NodeAdapter;
//# sourceMappingURL=NodeAdapter.js.map