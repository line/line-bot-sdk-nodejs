import { MessagingApiBlobClient } from "../../api.js";

import { GetMessageContentTranscodingResponse } from "../../model/getMessageContentTranscodingResponse.js";

import { createServer } from "node:http";
import { deepEqual, equal, ok } from "node:assert";

import { describe, it } from "vitest";

const channel_access_token = "test_channel_access_token";

// This is not a perfect multipart/form-data parser,
// but it works for the purpose of this test.
function parseForm(arrayBuffer: ArrayBuffer): Record<string, string | Blob> {
  const uint8Array = new Uint8Array(arrayBuffer);
  const text = new TextDecoder().decode(uint8Array);

  const boundary = text.match(/^--[^\r\n]+/)![0];

  // split to parts, and drop first and last empty parts
  const parts = text.split(new RegExp(boundary + "(?:\\r\\n|--)")).slice(1, -1);

  const result: Record<string, string | Blob> = {};

  for (const part of parts) {
    const headerEnd = part.indexOf("\r\n\r\n");
    if (headerEnd === -1) continue;

    const headers = part.slice(0, headerEnd);
    const content = part.slice(headerEnd + 4);

    const nameMatch = headers.match(/name="([^"]+)"/);
    const fileNameMatch = headers.match(/filename="([^"]+)"/);

    if (nameMatch) {
      const name = nameMatch[1];

      if (fileNameMatch) {
        // it's a file
        const contentTypeMatch = headers.match(/Content-Type:\s*(\S+)/i);
        const contentType = contentTypeMatch
          ? contentTypeMatch[1]
          : "application/octet-stream";

        result[name] = new Blob([content.replace(/\r\n$/, "")], {
          type: contentType,
        });
      } else {
        // basic field
        const value = content.trim();
        result[name] = value;
      }
    }
  }

  return result;
}

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
      equal(req.headers["user-agent"], "@line/bot-sdk/1.0.0-test");

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
      equal(req.headers["user-agent"], "@line/bot-sdk/1.0.0-test");

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
      equal(req.headers["user-agent"], "@line/bot-sdk/1.0.0-test");

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
      equal(req.headers["user-agent"], "@line/bot-sdk/1.0.0-test");

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
      equal(req.headers["user-agent"], "@line/bot-sdk/1.0.0-test");

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
      equal(req.headers["user-agent"], "@line/bot-sdk/1.0.0-test");

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
      equal(req.headers["user-agent"], "@line/bot-sdk/1.0.0-test");

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
      equal(req.headers["user-agent"], "@line/bot-sdk/1.0.0-test");

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
      equal(req.headers["user-agent"], "@line/bot-sdk/1.0.0-test");

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
      equal(req.headers["user-agent"], "@line/bot-sdk/1.0.0-test");

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
