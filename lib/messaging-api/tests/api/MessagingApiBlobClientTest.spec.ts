import { MessagingApiBlobClient } from "../../api";

import { GetMessageContentTranscodingResponse } from "../../model/getMessageContentTranscodingResponse";

import { createServer } from "node:http";
import { deepEqual, equal, ok } from "node:assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("MessagingApiBlobClient", () => {
  it("getMessageContentWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/message/{messageId}/content".replace("{messageId}", "DUMMY"), // string
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

    const client = new MessagingApiBlobClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getMessageContentWithHttpInfo(
      // messageId: string
      "DUMMY", // messageId(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("getMessageContent", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/message/{messageId}/content".replace("{messageId}", "DUMMY"), // string
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

    const client = new MessagingApiBlobClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getMessageContent(
      // messageId: string
      "DUMMY", // messageId(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("getMessageContentPreviewWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/message/{messageId}/content/preview".replace(
          "{messageId}",
          "DUMMY",
        ), // string
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

    const client = new MessagingApiBlobClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getMessageContentPreviewWithHttpInfo(
      // messageId: string
      "DUMMY", // messageId(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("getMessageContentPreview", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/message/{messageId}/content/preview".replace(
          "{messageId}",
          "DUMMY",
        ), // string
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

    const client = new MessagingApiBlobClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getMessageContentPreview(
      // messageId: string
      "DUMMY", // messageId(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("getMessageContentTranscodingByMessageIdWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/message/{messageId}/content/transcoding".replace(
          "{messageId}",
          "DUMMY",
        ), // string
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

    const client = new MessagingApiBlobClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res =
      await client.getMessageContentTranscodingByMessageIdWithHttpInfo(
        // messageId: string
        "DUMMY", // messageId(string)
      );

    equal(requestCount, 1);
    server.close();
  });

  it("getMessageContentTranscodingByMessageId", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/message/{messageId}/content/transcoding".replace(
          "{messageId}",
          "DUMMY",
        ), // string
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

    const client = new MessagingApiBlobClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getMessageContentTranscodingByMessageId(
      // messageId: string
      "DUMMY", // messageId(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("getRichMenuImageWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/richmenu/{richMenuId}/content".replace(
          "{richMenuId}",
          "DUMMY",
        ), // string
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

    const client = new MessagingApiBlobClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getRichMenuImageWithHttpInfo(
      // richMenuId: string
      "DUMMY", // richMenuId(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("getRichMenuImage", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/richmenu/{richMenuId}/content".replace(
          "{richMenuId}",
          "DUMMY",
        ), // string
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

    const client = new MessagingApiBlobClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getRichMenuImage(
      // richMenuId: string
      "DUMMY", // richMenuId(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("setRichMenuImageWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/richmenu/{richMenuId}/content".replace(
          "{richMenuId}",
          "DUMMY",
        ), // string
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

    const client = new MessagingApiBlobClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.setRichMenuImageWithHttpInfo(
      // richMenuId: string
      "DUMMY", // richMenuId(string)

      // body: Blob
      new Blob([]), // paramName=body
    );

    equal(requestCount, 1);
    server.close();
  });

  it("setRichMenuImage", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/richmenu/{richMenuId}/content".replace(
          "{richMenuId}",
          "DUMMY",
        ), // string
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

    const client = new MessagingApiBlobClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.setRichMenuImage(
      // richMenuId: string
      "DUMMY", // richMenuId(string)

      // body: Blob
      new Blob([]), // paramName=body
    );

    equal(requestCount, 1);
    server.close();
  });
});
