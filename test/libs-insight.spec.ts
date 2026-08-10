import { insight } from "../lib/index.js";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal } from "node:assert";

import { describe, it, beforeAll, afterAll, afterEach } from "vitest";

const channelAccessToken = "test_channel_access_token";

const client = new insight.InsightClient({
  channelAccessToken,
});

describe("insight", () => {
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

  it("getStatisticsPerUnit sends camelCase query parameters", async () => {
    let capturedUrl: URL | undefined;
    server.use(
      http.get(
        "https://api.line.me/v2/bot/insight/message/event/aggregation",
        ({ request }) => {
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          capturedUrl = new URL(request.url);
          return HttpResponse.json({
            overview: { uniqueImpression: 100 },
          });
        },
      ),
    );

    const res = await client.getStatisticsPerUnit(
      "Promotion_A",
      "20240101",
      "20240131",
    );

    equal(
      capturedUrl?.searchParams.get("customAggregationUnit"),
      "Promotion_A",
    );
    equal(capturedUrl?.searchParams.get("from"), "20240101");
    equal(capturedUrl?.searchParams.get("to"), "20240131");
    deepEqual(res, { overview: { uniqueImpression: 100 } });
  });
});
