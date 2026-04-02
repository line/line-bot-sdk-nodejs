import { manageAudience } from "../lib/index.js";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal, match } from "node:assert";

import { describe, it, beforeAll, afterAll, afterEach } from "vitest";

const channelAccessToken = "test_channel_access_token";

const client = new manageAudience.ManageAudienceClient({
  channelAccessToken,
});

const blobClient = new manageAudience.ManageAudienceBlobClient({
  channelAccessToken,
});

describe("manageAudience", () => {
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

  it("createAudienceForUploadingUserIds", async () => {
    let requestCount = 0;
    server.use(
      http.post(
        "https://api-data.line.me/v2/bot/audienceGroup/upload/byFile",
        ({ request }) => {
          requestCount++;

          equal(
            request.headers.get("Authorization"),
            `Bearer test_channel_access_token`,
          );
          equal(request.headers.get("User-Agent"), "@line/bot-sdk/1.0.0-test");
          match(
            request.headers.get("content-type")!!,
            /^multipart\/form-data; boundary=.*$/,
          );

          return HttpResponse.json({});
        },
      ),
    );

    const res = await blobClient.createAudienceForUploadingUserIds(
      new Blob(["c9161b19-57f8-46c2-a71f-dfa87314dabe"], {
        type: "text/plain",
      }),
      "test_description",
      true,
    );
    equal(requestCount, 1);
    deepEqual(res, {});
  });

  it("getAudienceData with integer path parameter", async () => {
    server.use(
      http.get(
        "https://api.line.me/v2/bot/audienceGroup/2345678909876",
        ({ request }) => {
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          return HttpResponse.json({
            audienceGroup: {
              audienceGroupId: 2345678909876,
              createRoute: "AD_MANAGER",
              type: "APP_EVENT",
              description: "audienceGroupName_03",
              status: "READY",
              audienceCount: 8619,
              created: 1608619802,
              permission: "READ",
              isIfaAudience: false,
            },
            jobs: [],
            adaccount: {
              name: "Ad Account Name",
            },
          });
        },
      ),
    );

    const res = await client.getAudienceData(2345678909876);
    equal(res.audienceGroup.audienceGroupId, 2345678909876);
    equal(res.audienceGroup.createRoute, "AD_MANAGER");
  });

  it("getAudienceGroups with encoded query parameter", async () => {
    server.use(
      http.get(
        "https://api.line.me/v2/bot/audienceGroup/list",
        ({ request }) => {
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          const url = new URL(request.url);
          equal(url.searchParams.get("size"), "40");
          equal(url.searchParams.get("page"), "1");
          equal(url.searchParams.get("description"), "audienceGroup Name");
          return HttpResponse.json({
            audienceGroups: [
              {
                audienceGroupId: 1234567890123,
                createRoute: "OA_MANAGER",
                type: "CLICK",
                description: "audienceGroup Name",
              },
              {
                audienceGroupId: 2345678901234,
                createRoute: "AD_MANAGER",
                type: "APP_EVENT",
                description: "audienceGroup Name",
              },
            ],
            hasNextPage: false,
            totalCount: 2,
            size: 40,
            page: 1,
          });
        },
      ),
    );

    const res = await client.getAudienceGroups(
      1,
      "audienceGroup Name",
      undefined,
      40,
    );
    equal(res.audienceGroups.length, 2);
    equal(res.audienceGroups[0].description, "audienceGroup Name");
  });

  it("createAudienceGroup with JSON body", async () => {
    server.use(
      http.post(
        "https://api.line.me/v2/bot/audienceGroup/upload",
        async ({ request }) => {
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          equal(request.headers.get("content-type"), "application/json");
          const body = await request.json();
          equal(body.description, "Test Audience");
          return HttpResponse.json(
            { description: "Test Audience response" },
            { status: 202 },
          );
        },
      ),
    );

    const res = await client.createAudienceGroup({
      description: "Test Audience",
    });
    equal(res.description, "Test Audience response");
  });
});
