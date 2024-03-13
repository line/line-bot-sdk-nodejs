import { LiffClient } from "../../api";

import { AddLiffAppRequest } from "../../model/addLiffAppRequest";
import { AddLiffAppResponse } from "../../model/addLiffAppResponse";
import { GetAllLiffAppsResponse } from "../../model/getAllLiffAppsResponse";
import { UpdateLiffAppRequest } from "../../model/updateLiffAppRequest";

import { createServer } from "node:http";
import { deepEqual, equal, ok } from "node:assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("LiffClient", () => {
  it("addLIFFAppWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(reqUrl.pathname, "/liff/v1/apps");

      equal(req.headers["authorization"], `Bearer ${channel_access_token}`);
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({}));
    });
    await new Promise(resolve => {
      server.listen(0);
      server.on("listening", resolve);
    });

    const serverAddress = server.address();
    if (typeof serverAddress === "string" || serverAddress === null) {
      throw new Error("Unexpected server address: " + serverAddress);
    }

    const client = new LiffClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.addLIFFAppWithHttpInfo(
      // addLiffAppRequest: AddLiffAppRequest
      {} as unknown as AddLiffAppRequest, // paramName=addLiffAppRequest
    );

    equal(requestCount, 1);
    server.close();
  });

  it("addLIFFApp", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(reqUrl.pathname, "/liff/v1/apps");

      equal(req.headers["authorization"], `Bearer ${channel_access_token}`);
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({}));
    });
    await new Promise(resolve => {
      server.listen(0);
      server.on("listening", resolve);
    });

    const serverAddress = server.address();
    if (typeof serverAddress === "string" || serverAddress === null) {
      throw new Error("Unexpected server address: " + serverAddress);
    }

    const client = new LiffClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.addLIFFApp(
      // addLiffAppRequest: AddLiffAppRequest
      {} as unknown as AddLiffAppRequest, // paramName=addLiffAppRequest
    );

    equal(requestCount, 1);
    server.close();
  });

  it("deleteLIFFAppWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "DELETE");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/liff/v1/apps/{liffId}".replace("{liffId}", "DUMMY"), // string
      );

      equal(req.headers["authorization"], `Bearer ${channel_access_token}`);
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({}));
    });
    await new Promise(resolve => {
      server.listen(0);
      server.on("listening", resolve);
    });

    const serverAddress = server.address();
    if (typeof serverAddress === "string" || serverAddress === null) {
      throw new Error("Unexpected server address: " + serverAddress);
    }

    const client = new LiffClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.deleteLIFFAppWithHttpInfo(
      // liffId: string
      "DUMMY", // liffId(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("deleteLIFFApp", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "DELETE");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/liff/v1/apps/{liffId}".replace("{liffId}", "DUMMY"), // string
      );

      equal(req.headers["authorization"], `Bearer ${channel_access_token}`);
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({}));
    });
    await new Promise(resolve => {
      server.listen(0);
      server.on("listening", resolve);
    });

    const serverAddress = server.address();
    if (typeof serverAddress === "string" || serverAddress === null) {
      throw new Error("Unexpected server address: " + serverAddress);
    }

    const client = new LiffClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.deleteLIFFApp(
      // liffId: string
      "DUMMY", // liffId(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("getAllLIFFAppsWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(reqUrl.pathname, "/liff/v1/apps");

      equal(req.headers["authorization"], `Bearer ${channel_access_token}`);
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({}));
    });
    await new Promise(resolve => {
      server.listen(0);
      server.on("listening", resolve);
    });

    const serverAddress = server.address();
    if (typeof serverAddress === "string" || serverAddress === null) {
      throw new Error("Unexpected server address: " + serverAddress);
    }

    const client = new LiffClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getAllLIFFAppsWithHttpInfo();

    equal(requestCount, 1);
    server.close();
  });

  it("getAllLIFFApps", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(reqUrl.pathname, "/liff/v1/apps");

      equal(req.headers["authorization"], `Bearer ${channel_access_token}`);
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({}));
    });
    await new Promise(resolve => {
      server.listen(0);
      server.on("listening", resolve);
    });

    const serverAddress = server.address();
    if (typeof serverAddress === "string" || serverAddress === null) {
      throw new Error("Unexpected server address: " + serverAddress);
    }

    const client = new LiffClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getAllLIFFApps();

    equal(requestCount, 1);
    server.close();
  });

  it("updateLIFFAppWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "PUT");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/liff/v1/apps/{liffId}".replace("{liffId}", "DUMMY"), // string
      );

      equal(req.headers["authorization"], `Bearer ${channel_access_token}`);
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({}));
    });
    await new Promise(resolve => {
      server.listen(0);
      server.on("listening", resolve);
    });

    const serverAddress = server.address();
    if (typeof serverAddress === "string" || serverAddress === null) {
      throw new Error("Unexpected server address: " + serverAddress);
    }

    const client = new LiffClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.updateLIFFAppWithHttpInfo(
      // liffId: string
      "DUMMY", // liffId(string)

      // updateLiffAppRequest: UpdateLiffAppRequest
      {} as unknown as UpdateLiffAppRequest, // paramName=updateLiffAppRequest
    );

    equal(requestCount, 1);
    server.close();
  });

  it("updateLIFFApp", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "PUT");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/liff/v1/apps/{liffId}".replace("{liffId}", "DUMMY"), // string
      );

      equal(req.headers["authorization"], `Bearer ${channel_access_token}`);
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({}));
    });
    await new Promise(resolve => {
      server.listen(0);
      server.on("listening", resolve);
    });

    const serverAddress = server.address();
    if (typeof serverAddress === "string" || serverAddress === null) {
      throw new Error("Unexpected server address: " + serverAddress);
    }

    const client = new LiffClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.updateLIFFApp(
      // liffId: string
      "DUMMY", // liffId(string)

      // updateLiffAppRequest: UpdateLiffAppRequest
      {} as unknown as UpdateLiffAppRequest, // paramName=updateLiffAppRequest
    );

    equal(requestCount, 1);
    server.close();
  });
});
