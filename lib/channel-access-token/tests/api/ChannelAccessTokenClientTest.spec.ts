import { ChannelAccessTokenClient } from "../../api";

import { ChannelAccessTokenKeyIdsResponse } from "../../model/channelAccessTokenKeyIdsResponse";
import { ErrorResponse } from "../../model/errorResponse";
import { IssueChannelAccessTokenResponse } from "../../model/issueChannelAccessTokenResponse";
import { IssueShortLivedChannelAccessTokenResponse } from "../../model/issueShortLivedChannelAccessTokenResponse";
import { IssueStatelessChannelAccessTokenResponse } from "../../model/issueStatelessChannelAccessTokenResponse";
import { VerifyChannelAccessTokenResponse } from "../../model/verifyChannelAccessTokenResponse";

import { createServer } from "node:http";
import { deepEqual, equal, ok } from "node:assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("ChannelAccessTokenClient", () => {
  it("getsAllValidChannelAccessTokenKeyIdsWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/oauth2/v2.1/tokens/kid"
          .replace("{clientAssertionType}", "DUMMY") // string
          .replace("{clientAssertion}", "DUMMY"), // string
      );

      // Query parameters
      const queryParams = new URLSearchParams(reqUrl.search);
      equal(
        queryParams.get("clientAssertionType"),
        String(
          // clientAssertionType: string
          "DUMMY" as unknown as string, // paramName=clientAssertionType(enum)
        ),
      );
      equal(
        queryParams.get("clientAssertion"),
        String(
          // clientAssertion: string
          "DUMMY" as unknown as string, // paramName=clientAssertion(enum)
        ),
      );

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

    const client = new ChannelAccessTokenClient({
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getsAllValidChannelAccessTokenKeyIdsWithHttpInfo(
      // clientAssertionType: string
      "DUMMY" as unknown as string, // paramName=clientAssertionType(enum)

      // clientAssertion: string
      "DUMMY" as unknown as string, // paramName=clientAssertion(enum)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("getsAllValidChannelAccessTokenKeyIds", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/oauth2/v2.1/tokens/kid"
          .replace("{clientAssertionType}", "DUMMY") // string
          .replace("{clientAssertion}", "DUMMY"), // string
      );

      // Query parameters
      const queryParams = new URLSearchParams(reqUrl.search);
      equal(
        queryParams.get("clientAssertionType"),
        String(
          // clientAssertionType: string
          "DUMMY" as unknown as string, // paramName=clientAssertionType(enum)
        ),
      );
      equal(
        queryParams.get("clientAssertion"),
        String(
          // clientAssertion: string
          "DUMMY" as unknown as string, // paramName=clientAssertion(enum)
        ),
      );

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

    const client = new ChannelAccessTokenClient({
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getsAllValidChannelAccessTokenKeyIds(
      // clientAssertionType: string
      "DUMMY" as unknown as string, // paramName=clientAssertionType(enum)

      // clientAssertion: string
      "DUMMY" as unknown as string, // paramName=clientAssertion(enum)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("issueChannelTokenWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/oauth/accessToken"
          .replace("{grantType}", "DUMMY") // string
          .replace("{clientId}", "DUMMY") // string
          .replace("{clientSecret}", "DUMMY"), // string
      );

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

    const client = new ChannelAccessTokenClient({
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.issueChannelTokenWithHttpInfo(
      // grantType: string
      "DUMMY", // grantType(string)

      // clientId: string
      "DUMMY", // clientId(string)

      // clientSecret: string
      "DUMMY", // clientSecret(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("issueChannelToken", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/oauth/accessToken"
          .replace("{grantType}", "DUMMY") // string
          .replace("{clientId}", "DUMMY") // string
          .replace("{clientSecret}", "DUMMY"), // string
      );

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

    const client = new ChannelAccessTokenClient({
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.issueChannelToken(
      // grantType: string
      "DUMMY", // grantType(string)

      // clientId: string
      "DUMMY", // clientId(string)

      // clientSecret: string
      "DUMMY", // clientSecret(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("issueChannelTokenByJWTWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/oauth2/v2.1/token"
          .replace("{grantType}", "DUMMY") // string
          .replace("{clientAssertionType}", "DUMMY") // string
          .replace("{clientAssertion}", "DUMMY"), // string
      );

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

    const client = new ChannelAccessTokenClient({
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.issueChannelTokenByJWTWithHttpInfo(
      // grantType: string
      "DUMMY", // grantType(string)

      // clientAssertionType: string
      "DUMMY", // clientAssertionType(string)

      // clientAssertion: string
      "DUMMY", // clientAssertion(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("issueChannelTokenByJWT", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/oauth2/v2.1/token"
          .replace("{grantType}", "DUMMY") // string
          .replace("{clientAssertionType}", "DUMMY") // string
          .replace("{clientAssertion}", "DUMMY"), // string
      );

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

    const client = new ChannelAccessTokenClient({
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.issueChannelTokenByJWT(
      // grantType: string
      "DUMMY", // grantType(string)

      // clientAssertionType: string
      "DUMMY", // clientAssertionType(string)

      // clientAssertion: string
      "DUMMY", // clientAssertion(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("issueStatelessChannelTokenWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/oauth2/v3/token"
          .replace("{grantType}", "DUMMY") // string
          .replace("{clientAssertionType}", "DUMMY") // string
          .replace("{clientAssertion}", "DUMMY") // string
          .replace("{clientId}", "DUMMY") // string
          .replace("{clientSecret}", "DUMMY"), // string
      );

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

    const client = new ChannelAccessTokenClient({
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.issueStatelessChannelTokenWithHttpInfo(
      // grantType: string
      "DUMMY" as unknown as string, // paramName=grantType(enum)

      // clientAssertionType: string
      "DUMMY" as unknown as string, // paramName=clientAssertionType(enum)

      // clientAssertion: string
      "DUMMY", // clientAssertion(string)

      // clientId: string
      "DUMMY", // clientId(string)

      // clientSecret: string
      "DUMMY", // clientSecret(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("issueStatelessChannelToken", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/oauth2/v3/token"
          .replace("{grantType}", "DUMMY") // string
          .replace("{clientAssertionType}", "DUMMY") // string
          .replace("{clientAssertion}", "DUMMY") // string
          .replace("{clientId}", "DUMMY") // string
          .replace("{clientSecret}", "DUMMY"), // string
      );

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

    const client = new ChannelAccessTokenClient({
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.issueStatelessChannelToken(
      // grantType: string
      "DUMMY" as unknown as string, // paramName=grantType(enum)

      // clientAssertionType: string
      "DUMMY" as unknown as string, // paramName=clientAssertionType(enum)

      // clientAssertion: string
      "DUMMY", // clientAssertion(string)

      // clientId: string
      "DUMMY", // clientId(string)

      // clientSecret: string
      "DUMMY", // clientSecret(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("revokeChannelTokenWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/oauth/revoke".replace("{accessToken}", "DUMMY"), // string
      );

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

    const client = new ChannelAccessTokenClient({
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.revokeChannelTokenWithHttpInfo(
      // accessToken: string
      "DUMMY", // accessToken(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("revokeChannelToken", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/oauth/revoke".replace("{accessToken}", "DUMMY"), // string
      );

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

    const client = new ChannelAccessTokenClient({
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.revokeChannelToken(
      // accessToken: string
      "DUMMY", // accessToken(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("revokeChannelTokenByJWTWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/oauth2/v2.1/revoke"
          .replace("{clientId}", "DUMMY") // string
          .replace("{clientSecret}", "DUMMY") // string
          .replace("{accessToken}", "DUMMY"), // string
      );

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

    const client = new ChannelAccessTokenClient({
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.revokeChannelTokenByJWTWithHttpInfo(
      // clientId: string
      "DUMMY", // clientId(string)

      // clientSecret: string
      "DUMMY", // clientSecret(string)

      // accessToken: string
      "DUMMY", // accessToken(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("revokeChannelTokenByJWT", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/oauth2/v2.1/revoke"
          .replace("{clientId}", "DUMMY") // string
          .replace("{clientSecret}", "DUMMY") // string
          .replace("{accessToken}", "DUMMY"), // string
      );

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

    const client = new ChannelAccessTokenClient({
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.revokeChannelTokenByJWT(
      // clientId: string
      "DUMMY", // clientId(string)

      // clientSecret: string
      "DUMMY", // clientSecret(string)

      // accessToken: string
      "DUMMY", // accessToken(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("verifyChannelTokenWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/oauth/verify".replace("{accessToken}", "DUMMY"), // string
      );

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

    const client = new ChannelAccessTokenClient({
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.verifyChannelTokenWithHttpInfo(
      // accessToken: string
      "DUMMY", // accessToken(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("verifyChannelToken", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/oauth/verify".replace("{accessToken}", "DUMMY"), // string
      );

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

    const client = new ChannelAccessTokenClient({
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.verifyChannelToken(
      // accessToken: string
      "DUMMY", // accessToken(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("verifyChannelTokenByJWTWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/oauth2/v2.1/verify".replace("{accessToken}", "DUMMY"), // string
      );

      // Query parameters
      const queryParams = new URLSearchParams(reqUrl.search);
      equal(
        queryParams.get("accessToken"),
        String(
          // accessToken: string
          "DUMMY" as unknown as string, // paramName=accessToken(enum)
        ),
      );

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

    const client = new ChannelAccessTokenClient({
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.verifyChannelTokenByJWTWithHttpInfo(
      // accessToken: string
      "DUMMY" as unknown as string, // paramName=accessToken(enum)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("verifyChannelTokenByJWT", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/oauth2/v2.1/verify".replace("{accessToken}", "DUMMY"), // string
      );

      // Query parameters
      const queryParams = new URLSearchParams(reqUrl.search);
      equal(
        queryParams.get("accessToken"),
        String(
          // accessToken: string
          "DUMMY" as unknown as string, // paramName=accessToken(enum)
        ),
      );

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

    const client = new ChannelAccessTokenClient({
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.verifyChannelTokenByJWT(
      // accessToken: string
      "DUMMY" as unknown as string, // paramName=accessToken(enum)
    );

    equal(requestCount, 1);
    server.close();
  });
});
