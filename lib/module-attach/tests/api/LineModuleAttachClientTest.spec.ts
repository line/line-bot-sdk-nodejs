import { LineModuleAttachClient } from "../../api";

import { AttachModuleResponse } from "../../model/attachModuleResponse";

import { createServer } from "node:http";
import { deepEqual, equal, ok } from "node:assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("LineModuleAttachClient", () => {
  it("attachModuleWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/module/auth/v1/token"
          .replace("{grantType}", "DUMMY") // string
          .replace("{code}", "DUMMY") // string
          .replace("{redirectUri}", "DUMMY") // string
          .replace("{codeVerifier}", "DUMMY") // string
          .replace("{clientId}", "DUMMY") // string
          .replace("{clientSecret}", "DUMMY") // string
          .replace("{region}", "DUMMY") // string
          .replace("{basicSearchId}", "DUMMY") // string
          .replace("{scope}", "DUMMY") // string
          .replace("{brandType}", "DUMMY"), // string
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

    const client = new LineModuleAttachClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.attachModuleWithHttpInfo(
      // grantType: string
      "DUMMY", // grantType(string)

      // code: string
      "DUMMY", // code(string)

      // redirectUri: string
      "DUMMY", // redirectUri(string)

      // codeVerifier: string
      "DUMMY", // codeVerifier(string)

      // clientId: string
      "DUMMY", // clientId(string)

      // clientSecret: string
      "DUMMY", // clientSecret(string)

      // region: string
      "DUMMY", // region(string)

      // basicSearchId: string
      "DUMMY", // basicSearchId(string)

      // scope: string
      "DUMMY", // scope(string)

      // brandType: string
      "DUMMY", // brandType(string)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("attachModule", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/module/auth/v1/token"
          .replace("{grantType}", "DUMMY") // string
          .replace("{code}", "DUMMY") // string
          .replace("{redirectUri}", "DUMMY") // string
          .replace("{codeVerifier}", "DUMMY") // string
          .replace("{clientId}", "DUMMY") // string
          .replace("{clientSecret}", "DUMMY") // string
          .replace("{region}", "DUMMY") // string
          .replace("{basicSearchId}", "DUMMY") // string
          .replace("{scope}", "DUMMY") // string
          .replace("{brandType}", "DUMMY"), // string
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

    const client = new LineModuleAttachClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.attachModule(
      // grantType: string
      "DUMMY", // grantType(string)

      // code: string
      "DUMMY", // code(string)

      // redirectUri: string
      "DUMMY", // redirectUri(string)

      // codeVerifier: string
      "DUMMY", // codeVerifier(string)

      // clientId: string
      "DUMMY", // clientId(string)

      // clientSecret: string
      "DUMMY", // clientSecret(string)

      // region: string
      "DUMMY", // region(string)

      // basicSearchId: string
      "DUMMY", // basicSearchId(string)

      // scope: string
      "DUMMY", // scope(string)

      // brandType: string
      "DUMMY", // brandType(string)
    );

    equal(requestCount, 1);
    server.close();
  });
});
