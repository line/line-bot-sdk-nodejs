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
  const client = new ChannelAccessTokenClient({
    channelAccessToken: channel_access_token,
  });

  it("getsAllValidChannelAccessTokenKeyIds", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/oauth2/v2.1/tokens/kid"
      .replace("{clientAssertionType}", "DUMMY") // string
      .replace("{clientAssertion}", "DUMMY"); // string

    const server = setupServer(
      http.get(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(
          request.headers.get("Authorization"),
          `Bearer ${channel_access_token}`,
        );
        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );
    server.listen();

    const res = await client.getsAllValidChannelAccessTokenKeyIds(
      // clientAssertionType: string
      "DUMMY" as unknown as string, // paramName=clientAssertionType(enum)
      // clientAssertion: string
      "DUMMY" as unknown as string, // paramName=clientAssertion(enum)
    );

    equal(requestCount, 1);

    server.close();
  });

  it("issueChannelToken", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/oauth/accessToken"
      .replace("{grantType}", "DUMMY") // string
      .replace("{clientId}", "DUMMY") // string
      .replace("{clientSecret}", "DUMMY"); // string

    const server = setupServer(
      http.post(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(
          request.headers.get("Authorization"),
          `Bearer ${channel_access_token}`,
        );
        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );
    server.listen();

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

  it("issueChannelTokenByJWT", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/oauth2/v2.1/token"
      .replace("{grantType}", "DUMMY") // string
      .replace("{clientAssertionType}", "DUMMY") // string
      .replace("{clientAssertion}", "DUMMY"); // string

    const server = setupServer(
      http.post(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(
          request.headers.get("Authorization"),
          `Bearer ${channel_access_token}`,
        );
        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );
    server.listen();

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

  it("issueStatelessChannelToken", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/oauth2/v3/token"
      .replace("{grantType}", "DUMMY") // string
      .replace("{clientAssertionType}", "DUMMY") // string
      .replace("{clientAssertion}", "DUMMY") // string
      .replace("{clientId}", "DUMMY") // string
      .replace("{clientSecret}", "DUMMY"); // string

    const server = setupServer(
      http.post(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(
          request.headers.get("Authorization"),
          `Bearer ${channel_access_token}`,
        );
        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );
    server.listen();

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

  it("revokeChannelToken", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/oauth/revoke".replace(
      "{accessToken}",
      "DUMMY",
    ); // string

    const server = setupServer(
      http.post(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(
          request.headers.get("Authorization"),
          `Bearer ${channel_access_token}`,
        );
        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );
    server.listen();

    const res = await client.revokeChannelToken(
      // accessToken: string
      "DUMMY", // accessToken(string)
    );

    equal(requestCount, 1);

    server.close();
  });

  it("revokeChannelTokenByJWT", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/oauth2/v2.1/revoke"
      .replace("{clientId}", "DUMMY") // string
      .replace("{clientSecret}", "DUMMY") // string
      .replace("{accessToken}", "DUMMY"); // string

    const server = setupServer(
      http.post(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(
          request.headers.get("Authorization"),
          `Bearer ${channel_access_token}`,
        );
        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );
    server.listen();

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

  it("verifyChannelToken", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/oauth/verify".replace(
      "{accessToken}",
      "DUMMY",
    ); // string

    const server = setupServer(
      http.post(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(
          request.headers.get("Authorization"),
          `Bearer ${channel_access_token}`,
        );
        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );
    server.listen();

    const res = await client.verifyChannelToken(
      // accessToken: string
      "DUMMY", // accessToken(string)
    );

    equal(requestCount, 1);

    server.close();
  });

  it("verifyChannelTokenByJWT", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/oauth2/v2.1/verify".replace(
      "{accessToken}",
      "DUMMY",
    ); // string

    const server = setupServer(
      http.get(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(
          request.headers.get("Authorization"),
          `Bearer ${channel_access_token}`,
        );
        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );
    server.listen();

    const res = await client.verifyChannelTokenByJWT(
      // accessToken: string
      "DUMMY" as unknown as string, // paramName=accessToken(enum)
    );

    equal(requestCount, 1);

    server.close();
  });
});
