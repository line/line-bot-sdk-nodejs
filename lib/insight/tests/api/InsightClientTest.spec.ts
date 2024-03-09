import { InsightClient } from "../../api";

import { GetFriendsDemographicsResponse } from "../../model/getFriendsDemographicsResponse";
import { GetMessageEventResponse } from "../../model/getMessageEventResponse";
import { GetNumberOfFollowersResponse } from "../../model/getNumberOfFollowersResponse";
import { GetNumberOfMessageDeliveriesResponse } from "../../model/getNumberOfMessageDeliveriesResponse";
import { GetStatisticsPerUnitResponse } from "../../model/getStatisticsPerUnitResponse";

import { createServer } from "node:http";
import { deepEqual, equal, ok } from "node:assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("InsightClient", () => {
  it("getFriendsDemographicsWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(reqUrl.pathname, "/v2/bot/insight/demographic");

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

    const client = new InsightClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getFriendsDemographicsWithHttpInfo();

    equal(requestCount, 1);
    server.close();
  });

  it("getFriendsDemographics", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(reqUrl.pathname, "/v2/bot/insight/demographic");

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

    const client = new InsightClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getFriendsDemographics();

    equal(requestCount, 1);
    server.close();
  });

  it("getMessageEventWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/insight/message/event".replace("{requestId}", "DUMMY"), // string
      );

      // Query parameters
      const queryParams = new URLSearchParams(reqUrl.search);
      equal(
        queryParams.get("requestId"),
        String(
          // requestId: string
          "DUMMY" as unknown as string, // paramName=requestId(enum)
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

    const client = new InsightClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getMessageEventWithHttpInfo(
      // requestId: string
      "DUMMY" as unknown as string, // paramName=requestId(enum)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("getMessageEvent", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/insight/message/event".replace("{requestId}", "DUMMY"), // string
      );

      // Query parameters
      const queryParams = new URLSearchParams(reqUrl.search);
      equal(
        queryParams.get("requestId"),
        String(
          // requestId: string
          "DUMMY" as unknown as string, // paramName=requestId(enum)
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

    const client = new InsightClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getMessageEvent(
      // requestId: string
      "DUMMY" as unknown as string, // paramName=requestId(enum)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("getNumberOfFollowersWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/insight/followers".replace("{date}", "DUMMY"), // string
      );

      // Query parameters
      const queryParams = new URLSearchParams(reqUrl.search);
      equal(
        queryParams.get("date"),
        String(
          // date: string
          "DUMMY" as unknown as string, // paramName=date(enum)
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

    const client = new InsightClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getNumberOfFollowersWithHttpInfo(
      // date: string
      "DUMMY" as unknown as string, // paramName=date(enum)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("getNumberOfFollowers", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/insight/followers".replace("{date}", "DUMMY"), // string
      );

      // Query parameters
      const queryParams = new URLSearchParams(reqUrl.search);
      equal(
        queryParams.get("date"),
        String(
          // date: string
          "DUMMY" as unknown as string, // paramName=date(enum)
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

    const client = new InsightClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getNumberOfFollowers(
      // date: string
      "DUMMY" as unknown as string, // paramName=date(enum)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("getNumberOfMessageDeliveriesWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/insight/message/delivery".replace("{date}", "DUMMY"), // string
      );

      // Query parameters
      const queryParams = new URLSearchParams(reqUrl.search);
      equal(
        queryParams.get("date"),
        String(
          // date: string
          "DUMMY" as unknown as string, // paramName=date(enum)
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

    const client = new InsightClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getNumberOfMessageDeliveriesWithHttpInfo(
      // date: string
      "DUMMY" as unknown as string, // paramName=date(enum)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("getNumberOfMessageDeliveries", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/insight/message/delivery".replace("{date}", "DUMMY"), // string
      );

      // Query parameters
      const queryParams = new URLSearchParams(reqUrl.search);
      equal(
        queryParams.get("date"),
        String(
          // date: string
          "DUMMY" as unknown as string, // paramName=date(enum)
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

    const client = new InsightClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getNumberOfMessageDeliveries(
      // date: string
      "DUMMY" as unknown as string, // paramName=date(enum)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("getStatisticsPerUnitWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/insight/message/event/aggregation"
          .replace("{customAggregationUnit}", "DUMMY") // string
          .replace("{from}", "DUMMY") // string
          .replace("{to}", "DUMMY"), // string
      );

      // Query parameters
      const queryParams = new URLSearchParams(reqUrl.search);
      equal(
        queryParams.get("customAggregationUnit"),
        String(
          // customAggregationUnit: string
          "DUMMY" as unknown as string, // paramName=customAggregationUnit(enum)
        ),
      );
      equal(
        queryParams.get("from"),
        String(
          // from: string
          "DUMMY" as unknown as string, // paramName=from(enum)
        ),
      );
      equal(
        queryParams.get("to"),
        String(
          // to: string
          "DUMMY" as unknown as string, // paramName=to(enum)
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

    const client = new InsightClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getStatisticsPerUnitWithHttpInfo(
      // customAggregationUnit: string
      "DUMMY" as unknown as string, // paramName=customAggregationUnit(enum)

      // from: string
      "DUMMY" as unknown as string, // paramName=from(enum)

      // to: string
      "DUMMY" as unknown as string, // paramName=to(enum)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("getStatisticsPerUnit", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/insight/message/event/aggregation"
          .replace("{customAggregationUnit}", "DUMMY") // string
          .replace("{from}", "DUMMY") // string
          .replace("{to}", "DUMMY"), // string
      );

      // Query parameters
      const queryParams = new URLSearchParams(reqUrl.search);
      equal(
        queryParams.get("customAggregationUnit"),
        String(
          // customAggregationUnit: string
          "DUMMY" as unknown as string, // paramName=customAggregationUnit(enum)
        ),
      );
      equal(
        queryParams.get("from"),
        String(
          // from: string
          "DUMMY" as unknown as string, // paramName=from(enum)
        ),
      );
      equal(
        queryParams.get("to"),
        String(
          // to: string
          "DUMMY" as unknown as string, // paramName=to(enum)
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

    const client = new InsightClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getStatisticsPerUnit(
      // customAggregationUnit: string
      "DUMMY" as unknown as string, // paramName=customAggregationUnit(enum)

      // from: string
      "DUMMY" as unknown as string, // paramName=from(enum)

      // to: string
      "DUMMY" as unknown as string, // paramName=to(enum)
    );

    equal(requestCount, 1);
    server.close();
  });
});
