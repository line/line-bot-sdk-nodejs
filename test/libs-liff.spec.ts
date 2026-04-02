import { liff } from "../lib/index.js";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal } from "node:assert";

import { describe, it, beforeAll, afterAll, afterEach } from "vitest";

const channelAccessToken = "test_channel_access_token";

const client = new liff.LiffClient({
  channelAccessToken,
});

describe("liff", () => {
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

  it("updateLIFFApp with empty response body", async () => {
    server.use(
      http.put(
        "https://api.line.me/liff/v1/apps/test-liff-id",
        ({ request }) => {
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          return new HttpResponse("", { status: 200 });
        },
      ),
    );

    const res = await client.updateLIFFApp("test-liff-id", {
      view: { type: "full", url: "https://example.com" },
    });
    // empty response should not throw
    deepEqual(res, null);
  });
});
