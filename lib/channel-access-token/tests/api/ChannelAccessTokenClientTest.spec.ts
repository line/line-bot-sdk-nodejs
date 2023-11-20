import { ChannelAccessTokenClient } from "../../api";

import { ChannelAccessTokenKeyIdsResponse } from "../../model/channelAccessTokenKeyIdsResponse";
import { ErrorResponse } from "../../model/errorResponse";
import { IssueChannelAccessTokenResponse } from "../../model/issueChannelAccessTokenResponse";
import { IssueShortLivedChannelAccessTokenResponse } from "../../model/issueShortLivedChannelAccessTokenResponse";
import { IssueStatelessChannelAccessTokenResponse } from "../../model/issueStatelessChannelAccessTokenResponse";
import { VerifyChannelAccessTokenResponse } from "../../model/verifyChannelAccessTokenResponse";

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal } from "assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("ChannelAccessTokenClient", () => {
  const server = setupServer();
  before(() => {
    server.listen();
  });
  after(() => {
    server.close();
  });
  afterEach(() => {
    server.resetHandlers();
  });

  const client = new ChannelAccessTokenClient({});

  it("getsAllValidChannelAccessTokenKeyIds", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/oauth2/v2.1/tokens/kid"
      .replace("{clientAssertionType}", "DUMMY") // string
      .replace("{clientAssertion}", "DUMMY"); // string

    server.use(
      http.get(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );

    const res = await client.getsAllValidChannelAccessTokenKeyIds(
      // clientAssertionType: string
      "DUMMY" as unknown as string, // paramName=clientAssertionType(enum)
      // clientAssertion: string
      "DUMMY" as unknown as string, // paramName=clientAssertion(enum)
    );

    equal(requestCount, 1);
  });

  it("issueChannelToken", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/oauth/accessToken"
      .replace("{grantType}", "DUMMY") // string
      .replace("{clientId}", "DUMMY") // string
      .replace("{clientSecret}", "DUMMY"); // string

    server.use(
      http.post(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );

    const res = await client.issueChannelToken(
      // grantType: string
      "DUMMY", // grantType(string)
      // clientId: string
      "DUMMY", // clientId(string)
      // clientSecret: string
      "DUMMY", // clientSecret(string)
    );

    equal(requestCount, 1);
  });

  it("issueChannelTokenByJWT", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/oauth2/v2.1/token"
      .replace("{grantType}", "DUMMY") // string
      .replace("{clientAssertionType}", "DUMMY") // string
      .replace("{clientAssertion}", "DUMMY"); // string

    server.use(
      http.post(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );

    const res = await client.issueChannelTokenByJWT(
      // grantType: string
      "DUMMY", // grantType(string)
      // clientAssertionType: string
      "DUMMY", // clientAssertionType(string)
      // clientAssertion: string
      "DUMMY", // clientAssertion(string)
    );

    equal(requestCount, 1);
  });

  it("issueStatelessChannelToken", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/oauth2/v3/token"
      .replace("{grantType}", "DUMMY") // string
      .replace("{clientAssertionType}", "DUMMY") // string
      .replace("{clientAssertion}", "DUMMY") // string
      .replace("{clientId}", "DUMMY") // string
      .replace("{clientSecret}", "DUMMY"); // string

    server.use(
      http.post(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );

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
  });

  it("revokeChannelToken", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/oauth/revoke".replace(
      "{accessToken}",
      "DUMMY",
    ); // string

    server.use(
      http.post(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );

    const res = await client.revokeChannelToken(
      // accessToken: string
      "DUMMY", // accessToken(string)
    );

    equal(requestCount, 1);
  });

  it("revokeChannelTokenByJWT", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/oauth2/v2.1/revoke"
      .replace("{clientId}", "DUMMY") // string
      .replace("{clientSecret}", "DUMMY") // string
      .replace("{accessToken}", "DUMMY"); // string

    server.use(
      http.post(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );

    const res = await client.revokeChannelTokenByJWT(
      // clientId: string
      "DUMMY", // clientId(string)
      // clientSecret: string
      "DUMMY", // clientSecret(string)
      // accessToken: string
      "DUMMY", // accessToken(string)
    );

    equal(requestCount, 1);
  });

  it("verifyChannelToken", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/oauth/verify".replace(
      "{accessToken}",
      "DUMMY",
    ); // string

    server.use(
      http.post(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );

    const res = await client.verifyChannelToken(
      // accessToken: string
      "DUMMY", // accessToken(string)
    );

    equal(requestCount, 1);
  });

  it("verifyChannelTokenByJWT", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/oauth2/v2.1/verify".replace(
      "{accessToken}",
      "DUMMY",
    ); // string

    server.use(
      http.get(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );

    const res = await client.verifyChannelTokenByJWT(
      // accessToken: string
      "DUMMY" as unknown as string, // paramName=accessToken(enum)
    );

    equal(requestCount, 1);
  });
});
