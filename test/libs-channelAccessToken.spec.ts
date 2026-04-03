import { channelAccessToken } from "../lib/index.js";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal } from "node:assert";

import { describe, it, beforeAll, afterAll, afterEach } from "vitest";

const client = new channelAccessToken.ChannelAccessTokenClient({});

describe("channelAccessToken", () => {
  const server = setupServer();
  beforeAll(() => {
    server.listen();
  });
  afterAll(() => {
    server.close();
  });
  afterEach(() => {
    server.resetHandlers();
  });

  it("issueStatelessChannelToken", async () => {
    server.use(
      http.post(
        "https://api.line.me/oauth2/v3/token",
        async ({ request, params, cookies }) => {
          equal(request.headers.get("User-Agent"), "@line/bot-sdk/1.0.0-test");
          equal(
            request.headers.get("content-type"),
            "application/x-www-form-urlencoded",
          );
          equal(
            await request.text(),
            "grant_type=test_client_id&client_id=1234&client_secret=test_code",
          );

          return HttpResponse.json({});
        },
      ),
    );

    const res = await client.issueStatelessChannelToken(
      "test_client_id",
      undefined,
      undefined,
      "1234",
      "test_code",
    );
    deepEqual(res, {});
  });

  it("verifyChannelTokenByJWT sends access_token as query parameter", async () => {
    let capturedUrl: URL | undefined;
    server.use(
      http.get("https://api.line.me/oauth2/v2.1/verify", ({ request }) => {
        capturedUrl = new URL(request.url);
        return HttpResponse.json({});
      }),
    );

    await client.verifyChannelTokenByJWT("my_token");

    equal(capturedUrl?.searchParams.get("access_token"), "my_token");
    equal(capturedUrl?.searchParams.get("accessToken"), null);
  });

  it("getsAllValidChannelAccessTokenKeyIds sends snake_case query parameters", async () => {
    let capturedUrl: URL | undefined;
    server.use(
      http.get("https://api.line.me/oauth2/v2.1/tokens/kid", ({ request }) => {
        capturedUrl = new URL(request.url);
        return HttpResponse.json({ kids: [] });
      }),
    );

    await client.getsAllValidChannelAccessTokenKeyIds(
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
      "my_jwt",
    );

    equal(
      capturedUrl?.searchParams.get("client_assertion_type"),
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    );
    equal(capturedUrl?.searchParams.get("client_assertion"), "my_jwt");
    equal(capturedUrl?.searchParams.get("clientAssertionType"), null);
    equal(capturedUrl?.searchParams.get("clientAssertion"), null);
  });

  it("issueStatelessChannelTokenByJWTAssertion", async () => {
    server.use(
      http.post("https://api.line.me/oauth2/v3/token", async ({ request }) => {
        const body = await request.text();
        const params = new URLSearchParams(body);
        equal(params.get("grant_type"), "client_credentials");
        equal(
          params.get("client_assertion_type"),
          "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        );
        equal(params.get("client_assertion"), "dummyClientAssertion");
        equal(params.has("client_id"), false);
        equal(params.has("client_secret"), false);

        return HttpResponse.json({
          access_token: "test_token",
          expires_in: 900,
          token_type: "Bearer",
        });
      }),
    );

    const res = await client.issueStatelessChannelTokenByJWTAssertion(
      "dummyClientAssertion",
    );
    equal(res.access_token, "test_token");
    equal(res.expires_in, 900);
    equal(res.token_type, "Bearer");
  });

  it("issueStatelessChannelTokenByClientSecret", async () => {
    server.use(
      http.post("https://api.line.me/oauth2/v3/token", async ({ request }) => {
        const body = await request.text();
        const params = new URLSearchParams(body);
        equal(params.get("grant_type"), "client_credentials");
        equal(params.has("client_assertion_type"), false);
        equal(params.has("client_assertion"), false);
        equal(params.get("client_id"), "1234");
        equal(params.get("client_secret"), "test_secret");

        return HttpResponse.json({
          access_token: "test_token",
          expires_in: 900,
          token_type: "Bearer",
        });
      }),
    );

    const res = await client.issueStatelessChannelTokenByClientSecret(
      "1234",
      "test_secret",
    );
    equal(res.access_token, "test_token");
    equal(res.expires_in, 900);
    equal(res.token_type, "Bearer");
  });
});
