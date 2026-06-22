import { moduleOperation } from "../lib/index.js";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal } from "node:assert";

import { describe, it, beforeAll, afterAll, afterEach } from "vitest";

const channelAccessToken = "test_channel_access_token";

const client = new moduleOperation.LineModuleClient({
  channelAccessToken,
});

describe("moduleOperation", () => {
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

  it("acquireChatControl substitutes chatId path param and posts JSON body", async () => {
    let requestCount = 0;
    server.use(
      http.post(
        "https://api.line.me/v2/bot/chat/U1234567890/control/acquire",
        async ({ request }) => {
          requestCount++;
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          deepEqual(await request.json(), { expired: false, ttl: 3600 });
          return HttpResponse.json({});
        },
      ),
    );

    await client.acquireChatControl("U1234567890", {
      expired: false,
      ttl: 3600,
    });
    equal(requestCount, 1);
  });

  it("getModules sends query parameters", async () => {
    let capturedUrl: URL | undefined;
    server.use(
      http.get("https://api.line.me/v2/bot/list", ({ request }) => {
        capturedUrl = new URL(request.url);
        return HttpResponse.json({ modules: [] });
      }),
    );

    await client.getModules("next-cursor", 50);
    equal(capturedUrl?.searchParams.get("start"), "next-cursor");
    equal(capturedUrl?.searchParams.get("limit"), "50");
  });
});
