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
});
