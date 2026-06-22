import { moduleAttach } from "../lib/index.js";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal } from "node:assert";

import { describe, it, beforeAll, afterAll, afterEach } from "vitest";

const channelAccessToken = "test_channel_access_token";

const client = new moduleAttach.LineModuleAttachClient({
  channelAccessToken,
});

describe("moduleAttach", () => {
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

  it("attachModule posts snake_case form and omits undefined optional params", async () => {
    let body: URLSearchParams | undefined;
    server.use(
      http.post(
        "https://manager.line.biz/module/auth/v1/token",
        async ({ request }) => {
          equal(
            request.headers.get("content-type"),
            "application/x-www-form-urlencoded",
          );
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          body = new URLSearchParams(await request.text());
          return HttpResponse.json({ bot: { basicId: "@example" } });
        },
      ),
    );

    const res = await client.attachModule(
      "authorization_code",
      "auth_code_value",
      "https://example.com/cb",
    );

    equal(body?.get("grant_type"), "authorization_code");
    equal(body?.get("code"), "auth_code_value");
    equal(body?.get("redirect_uri"), "https://example.com/cb");
    equal(body?.has("code_verifier"), false);
    equal(body?.has("client_id"), false);
    equal(body?.has("client_secret"), false);
    equal(body?.has("region"), false);
    equal(body?.has("basic_search_id"), false);
    equal(body?.has("scope"), false);
    equal(body?.has("brand_type"), false);
    deepEqual(res, { bot: { basicId: "@example" } });
  });
});
