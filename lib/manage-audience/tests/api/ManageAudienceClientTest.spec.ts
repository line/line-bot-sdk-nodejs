import { ManageAudienceClient } from "../../api";

import { AddAudienceToAudienceGroupRequest } from "../../model/addAudienceToAudienceGroupRequest";
import { AudienceGroupCreateRoute } from "../../model/audienceGroupCreateRoute";
import { AudienceGroupStatus } from "../../model/audienceGroupStatus";
import { CreateAudienceGroupRequest } from "../../model/createAudienceGroupRequest";
import { CreateAudienceGroupResponse } from "../../model/createAudienceGroupResponse";
import { CreateClickBasedAudienceGroupRequest } from "../../model/createClickBasedAudienceGroupRequest";
import { CreateClickBasedAudienceGroupResponse } from "../../model/createClickBasedAudienceGroupResponse";
import { CreateImpBasedAudienceGroupRequest } from "../../model/createImpBasedAudienceGroupRequest";
import { CreateImpBasedAudienceGroupResponse } from "../../model/createImpBasedAudienceGroupResponse";
import { ErrorResponse } from "../../model/errorResponse";
import { GetAudienceDataResponse } from "../../model/getAudienceDataResponse";
import { GetAudienceGroupAuthorityLevelResponse } from "../../model/getAudienceGroupAuthorityLevelResponse";
import { GetAudienceGroupsResponse } from "../../model/getAudienceGroupsResponse";
import { UpdateAudienceGroupAuthorityLevelRequest } from "../../model/updateAudienceGroupAuthorityLevelRequest";
import { UpdateAudienceGroupDescriptionRequest } from "../../model/updateAudienceGroupDescriptionRequest";

import { createServer } from "node:http";
import { deepEqual, equal, ok } from "node:assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("ManageAudienceClient", () => {
  it("activateAudienceGroupWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "PUT");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/audienceGroup/{audienceGroupId}/activate".replace(
          "{audienceGroupId}",
          "0",
        ), // number
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

    const client = new ManageAudienceClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.activateAudienceGroupWithHttpInfo(
      // audienceGroupId: number
      0, // paramName=audienceGroupId(number or int or long)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("activateAudienceGroup", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "PUT");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/audienceGroup/{audienceGroupId}/activate".replace(
          "{audienceGroupId}",
          "0",
        ), // number
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

    const client = new ManageAudienceClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.activateAudienceGroup(
      // audienceGroupId: number
      0, // paramName=audienceGroupId(number or int or long)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("addAudienceToAudienceGroupWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "PUT");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(reqUrl.pathname, "/v2/bot/audienceGroup/upload");

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

    const client = new ManageAudienceClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.addAudienceToAudienceGroupWithHttpInfo(
      // addAudienceToAudienceGroupRequest: AddAudienceToAudienceGroupRequest
      {} as unknown as AddAudienceToAudienceGroupRequest, // paramName=addAudienceToAudienceGroupRequest
    );

    equal(requestCount, 1);
    server.close();
  });

  it("addAudienceToAudienceGroup", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "PUT");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(reqUrl.pathname, "/v2/bot/audienceGroup/upload");

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

    const client = new ManageAudienceClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.addAudienceToAudienceGroup(
      // addAudienceToAudienceGroupRequest: AddAudienceToAudienceGroupRequest
      {} as unknown as AddAudienceToAudienceGroupRequest, // paramName=addAudienceToAudienceGroupRequest
    );

    equal(requestCount, 1);
    server.close();
  });

  it("createAudienceGroupWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(reqUrl.pathname, "/v2/bot/audienceGroup/upload");

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

    const client = new ManageAudienceClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.createAudienceGroupWithHttpInfo(
      // createAudienceGroupRequest: CreateAudienceGroupRequest
      {} as unknown as CreateAudienceGroupRequest, // paramName=createAudienceGroupRequest
    );

    equal(requestCount, 1);
    server.close();
  });

  it("createAudienceGroup", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(reqUrl.pathname, "/v2/bot/audienceGroup/upload");

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

    const client = new ManageAudienceClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.createAudienceGroup(
      // createAudienceGroupRequest: CreateAudienceGroupRequest
      {} as unknown as CreateAudienceGroupRequest, // paramName=createAudienceGroupRequest
    );

    equal(requestCount, 1);
    server.close();
  });

  it("createClickBasedAudienceGroupWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(reqUrl.pathname, "/v2/bot/audienceGroup/click");

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

    const client = new ManageAudienceClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.createClickBasedAudienceGroupWithHttpInfo(
      // createClickBasedAudienceGroupRequest: CreateClickBasedAudienceGroupRequest
      {} as unknown as CreateClickBasedAudienceGroupRequest, // paramName=createClickBasedAudienceGroupRequest
    );

    equal(requestCount, 1);
    server.close();
  });

  it("createClickBasedAudienceGroup", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(reqUrl.pathname, "/v2/bot/audienceGroup/click");

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

    const client = new ManageAudienceClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.createClickBasedAudienceGroup(
      // createClickBasedAudienceGroupRequest: CreateClickBasedAudienceGroupRequest
      {} as unknown as CreateClickBasedAudienceGroupRequest, // paramName=createClickBasedAudienceGroupRequest
    );

    equal(requestCount, 1);
    server.close();
  });

  it("createImpBasedAudienceGroupWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(reqUrl.pathname, "/v2/bot/audienceGroup/imp");

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

    const client = new ManageAudienceClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.createImpBasedAudienceGroupWithHttpInfo(
      // createImpBasedAudienceGroupRequest: CreateImpBasedAudienceGroupRequest
      {} as unknown as CreateImpBasedAudienceGroupRequest, // paramName=createImpBasedAudienceGroupRequest
    );

    equal(requestCount, 1);
    server.close();
  });

  it("createImpBasedAudienceGroup", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "POST");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(reqUrl.pathname, "/v2/bot/audienceGroup/imp");

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

    const client = new ManageAudienceClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.createImpBasedAudienceGroup(
      // createImpBasedAudienceGroupRequest: CreateImpBasedAudienceGroupRequest
      {} as unknown as CreateImpBasedAudienceGroupRequest, // paramName=createImpBasedAudienceGroupRequest
    );

    equal(requestCount, 1);
    server.close();
  });

  it("deleteAudienceGroupWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "DELETE");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/audienceGroup/{audienceGroupId}".replace(
          "{audienceGroupId}",
          "0",
        ), // number
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

    const client = new ManageAudienceClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.deleteAudienceGroupWithHttpInfo(
      // audienceGroupId: number
      0, // paramName=audienceGroupId(number or int or long)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("deleteAudienceGroup", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "DELETE");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/audienceGroup/{audienceGroupId}".replace(
          "{audienceGroupId}",
          "0",
        ), // number
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

    const client = new ManageAudienceClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.deleteAudienceGroup(
      // audienceGroupId: number
      0, // paramName=audienceGroupId(number or int or long)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("getAudienceDataWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/audienceGroup/{audienceGroupId}".replace(
          "{audienceGroupId}",
          "0",
        ), // number
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

    const client = new ManageAudienceClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getAudienceDataWithHttpInfo(
      // audienceGroupId: number
      0, // paramName=audienceGroupId(number or int or long)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("getAudienceData", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/audienceGroup/{audienceGroupId}".replace(
          "{audienceGroupId}",
          "0",
        ), // number
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

    const client = new ManageAudienceClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getAudienceData(
      // audienceGroupId: number
      0, // paramName=audienceGroupId(number or int or long)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("getAudienceGroupAuthorityLevelWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(reqUrl.pathname, "/v2/bot/audienceGroup/authorityLevel");

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

    const client = new ManageAudienceClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getAudienceGroupAuthorityLevelWithHttpInfo();

    equal(requestCount, 1);
    server.close();
  });

  it("getAudienceGroupAuthorityLevel", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(reqUrl.pathname, "/v2/bot/audienceGroup/authorityLevel");

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

    const client = new ManageAudienceClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getAudienceGroupAuthorityLevel();

    equal(requestCount, 1);
    server.close();
  });

  it("getAudienceGroupsWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/audienceGroup/list"
          .replace("{page}", "0") // number
          .replace("{description}", "DUMMY") // string
          .replace("{size}", "0"), // number
      );

      // Query parameters
      const queryParams = new URLSearchParams(reqUrl.search);
      equal(
        queryParams.get("page"),
        String(
          // page: number
          "DUMMY" as unknown as number, // paramName=page(enum)
        ),
      );
      equal(
        queryParams.get("description"),
        String(
          // description: string
          "DUMMY" as unknown as string, // paramName=description(enum)
        ),
      );
      equal(
        queryParams.get("status"),
        String(
          // status: AudienceGroupStatus
          "DUMMY" as unknown as AudienceGroupStatus, // paramName=status(enum)
        ),
      );
      equal(
        queryParams.get("size"),
        String(
          // size: number
          "DUMMY" as unknown as number, // paramName=size(enum)
        ),
      );
      equal(
        queryParams.get("includesExternalPublicGroups"),
        String(
          // includesExternalPublicGroups: boolean
          "DUMMY" as unknown as boolean, // paramName=includesExternalPublicGroups(enum)
        ),
      );
      equal(
        queryParams.get("createRoute"),
        String(
          // createRoute: AudienceGroupCreateRoute
          "DUMMY" as unknown as AudienceGroupCreateRoute, // paramName=createRoute(enum)
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

    const client = new ManageAudienceClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getAudienceGroupsWithHttpInfo(
      // page: number
      "DUMMY" as unknown as number, // paramName=page(enum)

      // description: string
      "DUMMY" as unknown as string, // paramName=description(enum)

      // status: AudienceGroupStatus
      "DUMMY" as unknown as AudienceGroupStatus, // paramName=status(enum)

      // size: number
      "DUMMY" as unknown as number, // paramName=size(enum)

      // includesExternalPublicGroups: boolean
      "DUMMY" as unknown as boolean, // paramName=includesExternalPublicGroups(enum)

      // createRoute: AudienceGroupCreateRoute
      "DUMMY" as unknown as AudienceGroupCreateRoute, // paramName=createRoute(enum)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("getAudienceGroups", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "GET");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/audienceGroup/list"
          .replace("{page}", "0") // number
          .replace("{description}", "DUMMY") // string
          .replace("{size}", "0"), // number
      );

      // Query parameters
      const queryParams = new URLSearchParams(reqUrl.search);
      equal(
        queryParams.get("page"),
        String(
          // page: number
          "DUMMY" as unknown as number, // paramName=page(enum)
        ),
      );
      equal(
        queryParams.get("description"),
        String(
          // description: string
          "DUMMY" as unknown as string, // paramName=description(enum)
        ),
      );
      equal(
        queryParams.get("status"),
        String(
          // status: AudienceGroupStatus
          "DUMMY" as unknown as AudienceGroupStatus, // paramName=status(enum)
        ),
      );
      equal(
        queryParams.get("size"),
        String(
          // size: number
          "DUMMY" as unknown as number, // paramName=size(enum)
        ),
      );
      equal(
        queryParams.get("includesExternalPublicGroups"),
        String(
          // includesExternalPublicGroups: boolean
          "DUMMY" as unknown as boolean, // paramName=includesExternalPublicGroups(enum)
        ),
      );
      equal(
        queryParams.get("createRoute"),
        String(
          // createRoute: AudienceGroupCreateRoute
          "DUMMY" as unknown as AudienceGroupCreateRoute, // paramName=createRoute(enum)
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

    const client = new ManageAudienceClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.getAudienceGroups(
      // page: number
      "DUMMY" as unknown as number, // paramName=page(enum)

      // description: string
      "DUMMY" as unknown as string, // paramName=description(enum)

      // status: AudienceGroupStatus
      "DUMMY" as unknown as AudienceGroupStatus, // paramName=status(enum)

      // size: number
      "DUMMY" as unknown as number, // paramName=size(enum)

      // includesExternalPublicGroups: boolean
      "DUMMY" as unknown as boolean, // paramName=includesExternalPublicGroups(enum)

      // createRoute: AudienceGroupCreateRoute
      "DUMMY" as unknown as AudienceGroupCreateRoute, // paramName=createRoute(enum)
    );

    equal(requestCount, 1);
    server.close();
  });

  it("updateAudienceGroupAuthorityLevelWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "PUT");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(reqUrl.pathname, "/v2/bot/audienceGroup/authorityLevel");

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

    const client = new ManageAudienceClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.updateAudienceGroupAuthorityLevelWithHttpInfo(
      // updateAudienceGroupAuthorityLevelRequest: UpdateAudienceGroupAuthorityLevelRequest
      {} as unknown as UpdateAudienceGroupAuthorityLevelRequest, // paramName=updateAudienceGroupAuthorityLevelRequest
    );

    equal(requestCount, 1);
    server.close();
  });

  it("updateAudienceGroupAuthorityLevel", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "PUT");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(reqUrl.pathname, "/v2/bot/audienceGroup/authorityLevel");

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

    const client = new ManageAudienceClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.updateAudienceGroupAuthorityLevel(
      // updateAudienceGroupAuthorityLevelRequest: UpdateAudienceGroupAuthorityLevelRequest
      {} as unknown as UpdateAudienceGroupAuthorityLevelRequest, // paramName=updateAudienceGroupAuthorityLevelRequest
    );

    equal(requestCount, 1);
    server.close();
  });

  it("updateAudienceGroupDescriptionWithHttpInfo", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "PUT");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/audienceGroup/{audienceGroupId}/updateDescription".replace(
          "{audienceGroupId}",
          "0",
        ), // number
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

    const client = new ManageAudienceClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.updateAudienceGroupDescriptionWithHttpInfo(
      // audienceGroupId: number
      0, // paramName=audienceGroupId(number or int or long)

      // updateAudienceGroupDescriptionRequest: UpdateAudienceGroupDescriptionRequest
      {} as unknown as UpdateAudienceGroupDescriptionRequest, // paramName=updateAudienceGroupDescriptionRequest
    );

    equal(requestCount, 1);
    server.close();
  });

  it("updateAudienceGroupDescription", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

      equal(req.method, "PUT");
      const reqUrl = new URL(req.url, "http://localhost/");
      equal(
        reqUrl.pathname,
        "/v2/bot/audienceGroup/{audienceGroupId}/updateDescription".replace(
          "{audienceGroupId}",
          "0",
        ), // number
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

    const client = new ManageAudienceClient({
      channelAccessToken: channel_access_token,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.updateAudienceGroupDescription(
      // audienceGroupId: number
      0, // paramName=audienceGroupId(number or int or long)

      // updateAudienceGroupDescriptionRequest: UpdateAudienceGroupDescriptionRequest
      {} as unknown as UpdateAudienceGroupDescriptionRequest, // paramName=updateAudienceGroupDescriptionRequest
    );

    equal(requestCount, 1);
    server.close();
  });
});
