import { LineModuleClient } from "../../api";

import { AcquireChatControlRequest } from "../../model/acquireChatControlRequest";
import { DetachModuleRequest } from "../../model/detachModuleRequest";
import { GetModulesResponse } from "../../model/getModulesResponse";

import { createServer } from "node:http";
import { deepEqual, equal, ok } from "node:assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("LineModuleClient", () => {
  it("acquireChatControlWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/chat/{chatId}/control/acquire".replace("{chatId}", "DUMMY"), // string
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

    const client = new LineModuleClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.acquireChatControlWithHttpInfo(
      // chatId: string
      "DUMMY", // chatId(string)

      // acquireChatControlRequest: AcquireChatControlRequest
      {} as unknown as AcquireChatControlRequest, // paramName=acquireChatControlRequest
    );

    equal(requestCount, 1);
    server.close();
  });

  it("acquireChatControl", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/chat/{chatId}/control/acquire".replace("{chatId}", "DUMMY"), // string
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

    const client = new LineModuleClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.acquireChatControl(
      // chatId: string
      "DUMMY", // chatId(string)

      // acquireChatControlRequest: AcquireChatControlRequest
      {} as unknown as AcquireChatControlRequest, // paramName=acquireChatControlRequest
    );

    equal(requestCount, 1);
    server.close();
  });

  it("detachModuleWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(reqUrl.pathname, "/v2/bot/channel/detach");

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

    const client = new LineModuleClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.detachModuleWithHttpInfo(
      // detachModuleRequest: DetachModuleRequest
      {} as unknown as DetachModuleRequest, // paramName=detachModuleRequest
    );

    equal(requestCount, 1);
    server.close();
  });

  it("detachModule", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(reqUrl.pathname, "/v2/bot/channel/detach");

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

    const client = new LineModuleClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.detachModule(
      // detachModuleRequest: DetachModuleRequest
      {} as unknown as DetachModuleRequest, // paramName=detachModuleRequest
    );

    equal(requestCount, 1);
    server.close();
  });

  it("getModulesWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/list"
          .replace("{start}", "DUMMY") // string
          .replace("{limit}", "0"), // number
      );

      // Query parameters
      const queryParams = new URLSearchParams(reqUrl.search);
      equal(
        queryParams.get("start"),
        String(
          // start: string
          "DUMMY" as unknown as string, // paramName=start(enum)
        ),
      );
      equal(
        queryParams.get("limit"),
        String(
          // limit: number
          "DUMMY" as unknown as number, // paramName=limit(enum)
        ),
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

    const client = new LineModuleClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getModulesWithHttpInfo(
      // start: string
      "DUMMY" as unknown as string, // paramName=start(enum)

      // limit: number
      "DUMMY" as unknown as number, // paramName=limit(enum)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("getModules", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/list"
          .replace("{start}", "DUMMY") // string
          .replace("{limit}", "0"), // number
      );

      // Query parameters
      const queryParams = new URLSearchParams(reqUrl.search);
      equal(
        queryParams.get("start"),
        String(
          // start: string
          "DUMMY" as unknown as string, // paramName=start(enum)
        ),
      );
      equal(
        queryParams.get("limit"),
        String(
          // limit: number
          "DUMMY" as unknown as number, // paramName=limit(enum)
        ),
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

    const client = new LineModuleClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getModules(
      // start: string
      "DUMMY" as unknown as string, // paramName=start(enum)

      // limit: number
      "DUMMY" as unknown as number, // paramName=limit(enum)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("releaseChatControlWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/chat/{chatId}/control/release".replace("{chatId}", "DUMMY"), // string
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

    const client = new LineModuleClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.releaseChatControlWithHttpInfo(
      // chatId: string
      "DUMMY", // chatId(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("releaseChatControl", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/chat/{chatId}/control/release".replace("{chatId}", "DUMMY"), // string
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

    const client = new LineModuleClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.releaseChatControl(
      // chatId: string
      "DUMMY", // chatId(string)
    );

    equal(requestCount, 1);
    server.close();
  });
});
