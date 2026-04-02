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

  it("getStatisticsPerUnit", async () => {
    server.use(
      http.get(
        "https://api.line.me/v2/bot/insight/message/event/aggregation",
        ({ request }) => {
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          const url = new URL(request.url);
          equal(url.searchParams.get("customAggregationUnit"), "a_bc_de");
          equal(url.searchParams.get("from"), "20210301");
          equal(url.searchParams.get("to"), "20210331");

          return HttpResponse.json({
            overview: {
              uniqueImpression: 40,
              uniqueClick: 30,
              uniqueMediaPlayed: 25,
              uniqueMediaPlayed100Percent: null,
            },
            messages: [
              {
                seq: 1,
                impression: 42,
                uniqueImpression: 40,
                uniqueMediaPlayed25Percent: null,
              },
            ],
            clicks: [
              {
                seq: 1,
                url: "https://developers.line.biz/",
                click: 35,
                uniqueClick: 25,
                uniqueClickOfRequest: null,
              },
            ],
          });
        },
      ),
    );

    const res = await client.getStatisticsPerUnit(
      "a_bc_de",
      "20210301",
      "20210331",
    );
    equal(res.overview.uniqueImpression, 40);
    equal(res.overview.uniqueClick, 30);
    equal(res.overview.uniqueMediaPlayed100Percent, null);
    equal(res.messages[0].seq, 1);
    equal(res.messages[0].impression, 42);
    equal(res.clicks[0].url, "https://developers.line.biz/");
  });

  it("getNumberOfFollowers - ready status", async () => {
    server.use(
      http.get(
        "https://api.line.me/v2/bot/insight/followers",
        ({ request }) => {
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          return HttpResponse.json({
            status: "ready",
            followers: 1000,
            targetedReaches: 900,
            blocks: 100,
          });
        },
      ),
    );

    const res = await client.getNumberOfFollowers();
    equal(res.status, "ready");
    equal(res.followers, 1000);
    equal(res.targetedReaches, 900);
    equal(res.blocks, 100);
  });

  it("getNumberOfFollowers - unready status with null fields", async () => {
    server.use(
      http.get(
        "https://api.line.me/v2/bot/insight/followers",
        ({ request }) => {
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          return HttpResponse.json({
            status: "unready",
            followers: null,
            targetedReaches: null,
            blocks: null,
          });
        },
      ),
    );

    const res = await client.getNumberOfFollowers();
    equal(res.status, "unready");
    equal(res.followers, null);
    equal(res.targetedReaches, null);
    equal(res.blocks, null);
  });
});
