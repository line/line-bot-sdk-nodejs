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

  it("addLIFFApp posts JSON body and returns liffId", async () => {
    server.use(
      http.post(
        "https://api.line.me/liff/v1/apps",
        async ({ request }) => {
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          equal(request.headers.get("content-type"), "application/json");
          deepEqual(await request.json(), {
            view: { type: "full", url: "https://example.com/" },
          });
          return HttpResponse.json({ liffId: "1234567890-abcdefgh" });
        },
      ),
    );

    const res = await client.addLIFFApp({
      view: { type: "full", url: "https://example.com/" },
    });
    deepEqual(res, { liffId: "1234567890-abcdefgh" });
  });

  it("updateLIFFApp builds path from liffId and sends PUT", async () => {
    let requestCount = 0;
    server.use(
      http.put(
        "https://api.line.me/liff/v1/apps/1234567890-abcdefgh",
        async ({ request }) => {
          requestCount++;
          deepEqual(await request.json(), {
            view: { type: "tall", url: "https://example.com/updated" },
          });
          return HttpResponse.json({});
        },
      ),
    );

    await client.updateLIFFApp("1234567890-abcdefgh", {
      view: { type: "tall", url: "https://example.com/updated" },
    });
    equal(requestCount, 1);
  });
});
