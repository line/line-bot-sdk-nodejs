import { moduleAttach } from "../lib/index.js";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal } from "node:assert";

import { describe, it, beforeAll, afterAll, afterEach } from "vitest";

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

  it("allow to change baseURL in module attach client", async () => {
    const client = new moduleAttach.LineModuleAttachClient({
      channelAccessToken: "test_channel_access_token",
      baseURL: "https://example.com",
    });

    server.use(
      http.post(
        "https://example.com/module/auth/v1/token",
        async ({ request }) => {
          equal(
            request.headers.get("content-type"),
            "application/x-www-form-urlencoded",
          );
          const body = await request.text();
          const params = new URLSearchParams(body);
          equal(params.get("grant_type"), "authorization_code");
          equal(params.get("code"), "test-code");
          equal(
            params.get("redirect_uri"),
            "https://example2.com/callback?key=value",
          );
          equal(params.get("scope"), "message:send message:receive");

          return HttpResponse.json({
            bot_id: "U111...",
            scopes: ["message:send", "message:receive"],
          });
        },
      ),
    );

    const res = await client.attachModule(
      "authorization_code",
      "test-code",
      "https://example2.com/callback?key=value",
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      "message:send message:receive",
    );
    equal(res.bot_id, "U111...");
    deepEqual(res.scopes, ["message:send", "message:receive"]);
  });
});
