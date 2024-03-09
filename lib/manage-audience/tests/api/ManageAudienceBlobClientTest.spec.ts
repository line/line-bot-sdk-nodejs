import { ManageAudienceBlobClient } from "../../api";

import { CreateAudienceGroupResponse } from "../../model/createAudienceGroupResponse";

import { createServer } from "node:http";
import { deepEqual, equal, ok } from "node:assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("ManageAudienceBlobClient", () => {
  it("addUserIdsToAudienceWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "PUT");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/audienceGroup/upload/byFile"
          .replace("{audienceGroupId}", "0") // number
          .replace("{uploadDescription}", "DUMMY"), // string
      );

      equal(req.headers["authorization"], `Bearer ${channel_access_token}`);
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);

      ok(
        req.headers["content-type"].startsWith(
          `multipart/form-data; boundary=`,
        ),
      );

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

    const client = new ManageAudienceBlobClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.addUserIdsToAudienceWithHttpInfo(
      // file: Blob
      new Blob([]), // paramName=file

      // audienceGroupId: number
      0, // paramName=audienceGroupId(number or int or long)

      // uploadDescription: string
      "DUMMY", // uploadDescription(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("addUserIdsToAudience", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "PUT");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/audienceGroup/upload/byFile"
          .replace("{audienceGroupId}", "0") // number
          .replace("{uploadDescription}", "DUMMY"), // string
      );

      equal(req.headers["authorization"], `Bearer ${channel_access_token}`);
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);

      ok(
        req.headers["content-type"].startsWith(
          `multipart/form-data; boundary=`,
        ),
      );

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

    const client = new ManageAudienceBlobClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.addUserIdsToAudience(
      // file: Blob
      new Blob([]), // paramName=file

      // audienceGroupId: number
      0, // paramName=audienceGroupId(number or int or long)

      // uploadDescription: string
      "DUMMY", // uploadDescription(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("createAudienceForUploadingUserIdsWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/audienceGroup/upload/byFile"
          .replace("{description}", "DUMMY") // string
          .replace("{uploadDescription}", "DUMMY"), // string
      );

      equal(req.headers["authorization"], `Bearer ${channel_access_token}`);
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);

      ok(
        req.headers["content-type"].startsWith(
          `multipart/form-data; boundary=`,
        ),
      );

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

    const client = new ManageAudienceBlobClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.createAudienceForUploadingUserIdsWithHttpInfo(
      // file: Blob
      new Blob([]), // paramName=file

      // description: string
      "DUMMY", // description(string)

      // isIfaAudience: boolean
      true, // paramName=isIfaAudience

      // uploadDescription: string
      "DUMMY", // uploadDescription(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("createAudienceForUploadingUserIds", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/audienceGroup/upload/byFile"
          .replace("{description}", "DUMMY") // string
          .replace("{uploadDescription}", "DUMMY"), // string
      );

      equal(req.headers["authorization"], `Bearer ${channel_access_token}`);
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);

      ok(
        req.headers["content-type"].startsWith(
          `multipart/form-data; boundary=`,
        ),
      );

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

    const client = new ManageAudienceBlobClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.createAudienceForUploadingUserIds(
      // file: Blob
      new Blob([]), // paramName=file

      // description: string
      "DUMMY", // description(string)

      // isIfaAudience: boolean
      true, // paramName=isIfaAudience

      // uploadDescription: string
      "DUMMY", // uploadDescription(string)
    );

    equal(requestCount, 1);
    server.close();
  });
});
