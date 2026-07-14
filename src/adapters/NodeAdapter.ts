export class NodeAdapter {
  private http: any;
  private https: any;
  private net: any;
  private tls: any;
  private dns: any;
  private crypto: any;
  private zlib: any;
  private stream: any;
  private events: any;
  private fs: any;
  private path: any;
  private os: any;
  private util: any;
  private url: any;
  private querystring: any;

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

  public getHTTP(): any {
    return this.http;
  }

  public getHTTPS(): any {
    return this.https;
  }

  public getNet(): any {
    return this.net;
  }

  public getTLS(): any {
    return this.tls;
  }

  public getDNS(): any {
    return this.dns;
  }

  public getCrypto(): any {
    return this.crypto;
  }

  public getZlib(): any {
    return this.zlib;
  }

  public getStream(): any {
    return this.stream;
  }

  public getEvents(): any {
    return this.events;
  }

  public getFS(): any {
    return this.fs;
  }

  public getPath(): any {
    return this.path;
  }

  public getOS(): any {
    return this.os;
  }

  public getUtil(): any {
    return this.util;
  }

  public getURL(): any {
    return this.url;
  }

  public getQuerystring(): any {
    return this.querystring;
  }
}