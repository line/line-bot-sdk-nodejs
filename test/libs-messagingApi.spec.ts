import { messagingApi } from "../lib/index.js";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal } from "node:assert";

import { describe, it, beforeAll, afterAll, afterEach } from "vitest";

const channelAccessToken = "test_channel_access_token";

const client = new messagingApi.MessagingApiClient({
  channelAccessToken,
});

const blobClient = new messagingApi.MessagingApiBlobClient({
  channelAccessToken,
});

describe("messagingApi", () => {
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

  it("setRichMenuImage", async () => {
    let requestCount = 0;
    server.use(
      http.post(
        "https://api-data.line.me/v2/bot/richmenu/aaaaaa/content",
        async ({ request, params, cookies }) => {
          requestCount++;

          equal(
            request.headers.get("Authorization"),
            `Bearer test_channel_access_token`,
          );
          equal(request.headers.get("User-Agent"), "@line/bot-sdk/1.0.0-test");
          equal(request.headers.get("content-type"), "image/jpeg");
          equal(await request.text(), "GREAT_JPEG");

          return HttpResponse.json({});
        },
      ),
    );

    const res = await blobClient.setRichMenuImage(
      "aaaaaa",
      new Blob(["GREAT_JPEG"], { type: "image/jpeg" }),
    );
    equal(requestCount, 1);
    deepEqual(res, {});
  });

  it("pushMessage", async () => {
    let requestCount = 0;
    server.use(
      http.post(
        "https://api.line.me/v2/bot/message/push",
        ({ request, params, cookies }) => {
          requestCount++;

          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          equal(request.headers.get("User-Agent"), "@line/bot-sdk/1.0.0-test");
          equal(request.headers.get("content-type"), "application/json");
          equal(request.headers.get("x-line-retry-key"), "KEYKEYKEYKEY");
          return HttpResponse.json({});
        },
      ),
    );

    const res = await client.pushMessage(
      { to: "uAAAAAAAAAAAAAA", messages: [{ type: "text", text: "aaaaaa" }] },
      "KEYKEYKEYKEY",
    );
    equal(requestCount, 1);
    deepEqual(res, {});
  });

  it("pushMessage without xLineRetryKey", async () => {
    let requestCount = 0;
    server.use(
      http.post(
        "https://api.line.me/v2/bot/message/push",
        ({ request, params, cookies }) => {
          requestCount++;

          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          equal(request.headers.get("User-Agent"), "@line/bot-sdk/1.0.0-test");
          equal(request.headers.get("content-type"), "application/json");
          equal(request.headers.get("x-line-retry-key"), undefined);
          return HttpResponse.json({});
        },
      ),
    );

    const res = await client.pushMessage(
      { to: "uAAAAAAAAAAAAAA", messages: [{ type: "text", text: "aaaaaa" }] },
      undefined,
    );
    equal(requestCount, 1);
    deepEqual(res, {});
  });

  it("get followers", async () => {
    let requestCount = 0;
    server.use(
      http.get(
        "https://api.line.me/v2/bot/followers/ids",
        async ({ request, params, cookies }) => {
          requestCount++;

          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          equal(request.headers.get("User-Agent"), "@line/bot-sdk/1.0.0-test");

          const url = new URL(request.url);
          const searchParams = url.searchParams;
          equal(searchParams.get("start"), "xBQU2IB");
          equal(searchParams.get("limit"), "100");

          return HttpResponse.json({
            userIds: ["UAAAAAAAAAAAAAA"],
            next: "yANU9IA..",
          });
        },
      ),
    );

    const res = await client.getFollowers("xBQU2IB", 100);
    deepEqual(res, {
      userIds: ["UAAAAAAAAAAAAAA"],
      next: "yANU9IA..",
    });
  });

  it("get followers without |start| parameter", async () => {
    let requestCount = 0;
    server.use(
      http.get(
        "https://api.line.me/v2/bot/followers/ids",
        async ({ request, params, cookies }) => {
          requestCount++;

          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          equal(request.headers.get("User-Agent"), "@line/bot-sdk/1.0.0-test");

          const url = new URL(request.url);
          const searchParams = url.searchParams;
          equal(searchParams.has("start"), false);
          equal(searchParams.get("limit"), "100");

          return HttpResponse.json({
            userIds: ["UAAAAAAAAAAAAAA"],
            next: "yANU9IA..",
          });
        },
      ),
    );

    const res = await client.getFollowers(undefined, 100);
    deepEqual(res, {
      userIds: ["UAAAAAAAAAAAAAA"],
      next: "yANU9IA..",
    });
  });

  it("get coupon list", async () => {
    let requestCount = 0;
    server.use(
      http.get(
        "https://api.line.me/v2/bot/coupon",
        async ({ request, params, cookies }) => {
          requestCount++;

          equal(
            request.headers.get("authorization"),
            "Bearer test_channel_access_token",
          );
          equal(request.headers.get("User-Agent"), "@line/bot-sdk/1.0.0-test");

          const url = new URL(request.url);
          const searchParams = url.searchParams;
          equal(searchParams.get("status"), "DRAFT,RUNNING,CLOSED");
          equal(searchParams.get("start"), "xBQU2IB");
          equal(searchParams.get("limit"), "100");

          return HttpResponse.json({
            items: [
              {
                couponId: "coupon_id_1",
                title: "coupon 1",
              },
            ],
            next: "yANU9IA..",
          });
        },
      ),
    );

    const res = await client.listCoupon(
      new Set(["DRAFT", "RUNNING", "CLOSED"]),
      "xBQU2IB",
      100,
    );
    deepEqual(res, {
      items: [
        {
          couponId: "coupon_id_1",
          title: "coupon 1",
        },
      ],
      next: "yANU9IA..",
    });
  });

  it("config is not overrided", async () => {
    const config = {
      channelAccessToken: "token-token",
      baseURL: undefined,
    };
    const client = new messagingApi.MessagingApiClient(config);
    equal(config.baseURL, undefined);

    const blobClient = new messagingApi.MessagingApiBlobClient(config);
    equal(config.baseURL, undefined);
  });

  it("authorization header is not overrided", async () => {
    const config = {
      channelAccessToken: "test_channel_access_token",
      defaultHeaders: {
        authorization: "Bearer test_channel_access_token_overrided",
      },
    };
    const client = new messagingApi.MessagingApiClient(config);

    let requestCount = 0;
    server.use(
      http.post(
        "https://api.line.me/v2/bot/message/push",
        ({ request, params, cookies }) => {
          requestCount++;

          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          equal(request.headers.get("User-Agent"), "@line/bot-sdk/1.0.0-test");
          equal(request.headers.get("content-type"), "application/json");
          equal(request.headers.get("x-line-retry-key"), "KEYKEYKEYKEY");
          return HttpResponse.json(
            {
              sentMessages: [
                {
                  id: "461230966842064897",
                  quoteToken: "IStG5h1Tz7b...",
                },
              ],
            },
            { status: 200 },
          );
        },
      ),
    );

    const res = await client.pushMessage(
      { to: "uAAAAAAAAAAAAAA", messages: [{ type: "text", text: "aaaaaa" }] },
      "KEYKEYKEYKEY",
    );
    equal(requestCount, 1);

    const expectedJson = {
      sentMessages: [
        {
          id: "461230966842064897",
          quoteToken: "IStG5h1Tz7b...",
        },
      ],
    };
    deepEqual(res, expectedJson);
  });

  it("getMessageContentTranscodingByMessageId", async () => {
    server.use(
      http.get(
        "https://api-data.line.me/v2/bot/message/test-message-id/content/transcoding",
        ({ request }) => {
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          return HttpResponse.json({ status: "processing" });
        },
      ),
    );

    const res =
      await blobClient.getMessageContentTranscodingByMessageId(
        "test-message-id",
      );
    deepEqual(res, { status: "processing" });
  });

  it("getRichMenuImage", async () => {
    server.use(
      http.get(
        "https://api-data.line.me/v2/bot/richmenu/test-rich-menu-id/content",
        ({ request }) => {
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          return new HttpResponse("binary data", {
            headers: { "Content-Type": "image/jpeg" },
          });
        },
      ),
    );

    const res = await blobClient.getRichMenuImage("test-rich-menu-id");
    equal(res != null, true);
    // Verify stream contains data by consuming it
    const chunks: Buffer[] = [];
    for await (const chunk of res) {
      chunks.push(Buffer.from(chunk));
    }
    const body = Buffer.concat(chunks).toString();
    equal(body, "binary data");
  });

  it("getNarrowcastProgress with missing JSON keys", async () => {
    server.use(
      http.get(
        "https://api.line.me/v2/bot/message/progress/narrowcast",
        ({ request }) => {
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          const url = new URL(request.url);
          equal(
            url.searchParams.get("requestId"),
            "7d51557c-7ba0-4ed7-991f-36b2a340dc1a",
          );
          return HttpResponse.json({
            phase: "waiting",
            acceptedTime: "2020-12-03T10:15:30.121Z",
          });
        },
      ),
    );

    const res = await client.getNarrowcastProgress(
      "7d51557c-7ba0-4ed7-991f-36b2a340dc1a",
    );
    equal(res.phase, "waiting");
    equal(res.acceptedTime, "2020-12-03T10:15:30.121Z");
    equal(res.errorCode, undefined);
    equal(res.completedTime, undefined);
  });

  it("getFollowers with limit and start", async () => {
    server.use(
      http.get("https://api.line.me/v2/bot/followers/ids", ({ request }) => {
        equal(
          request.headers.get("Authorization"),
          "Bearer test_channel_access_token",
        );
        const url = new URL(request.url);
        equal(url.searchParams.get("start"), "from_previous_NEXT");
        equal(url.searchParams.get("limit"), "10");
        return HttpResponse.json({
          userIds: ["U1234567890", "U0987654321"],
          next: "nExT_Token",
        });
      }),
    );

    const res = await client.getFollowers("from_previous_NEXT", 10);
    deepEqual(res.userIds, ["U1234567890", "U0987654321"]);
    equal(res.next, "nExT_Token");
  });

  it("getFollowers two consecutive requests do not carry over state", async () => {
    server.use(
      http.get("https://api.line.me/v2/bot/followers/ids", ({ request }) => {
        const url = new URL(request.url);
        const start = url.searchParams.get("start");
        const limit = url.searchParams.get("limit");

        if (start === "from_previous_NEXT" && limit === "10") {
          return HttpResponse.json({
            userIds: ["U1111111111", "U2222222222"],
            next: "firstNextToken",
          });
        }
        if (start === "anotherParam" && limit === "5") {
          return HttpResponse.json({
            userIds: ["U3333333333", "U4444444444"],
          });
        }
        throw new Error(`Unexpected params: start=${start}, limit=${limit}`);
      }),
    );

    // First request
    const res1 = await client.getFollowers("from_previous_NEXT", 10);
    deepEqual(res1.userIds, ["U1111111111", "U2222222222"]);
    equal(res1.next, "firstNextToken");

    // Second request with different params - must not carry over first request's params
    const res2 = await client.getFollowers("anotherParam", 5);
    deepEqual(res2.userIds, ["U3333333333", "U4444444444"]);
    equal(res2.next, undefined);
  });

  it("getDefaultRichMenuId", async () => {
    server.use(
      http.get(
        "https://api.line.me/v2/bot/user/all/richmenu",
        ({ request }) => {
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          return HttpResponse.json({ richMenuId: "richmenuid" });
        },
      ),
    );

    const res = await client.getDefaultRichMenuId();
    equal(res.richMenuId, "richmenuid");
  });

  it("setDefaultRichMenu", async () => {
    let capturedUrl: string | undefined;
    server.use(
      http.post(
        "https://api.line.me/v2/bot/user/all/richmenu/:richMenuId",
        ({ request, params }) => {
          capturedUrl = request.url;
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          equal(params.richMenuId, "richmenuid");
          return HttpResponse.json({});
        },
      ),
    );

    const res = await client.setDefaultRichMenu("richmenuid");
    deepEqual(res, {});
    equal(capturedUrl?.includes("richmenuid"), true);
  });

  it("cancelDefaultRichMenu", async () => {
    let capturedMethod: string | undefined;
    server.use(
      http.delete(
        "https://api.line.me/v2/bot/user/all/richmenu",
        ({ request }) => {
          capturedMethod = request.method;
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          return HttpResponse.json({});
        },
      ),
    );

    const res = await client.cancelDefaultRichMenu();
    deepEqual(res, {});
    equal(capturedMethod, "DELETE");
  });

  it("broadcast with empty json response", async () => {
    server.use(
      http.post(
        "https://api.line.me/v2/bot/message/broadcast",
        async ({ request }) => {
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          const body = await request.json();
          equal(body.messages[0].type, "text");
          equal(body.messages[0].text, "Hello, world!");
          equal(request.headers.get("x-line-retry-key"), null);
          return HttpResponse.json({});
        },
      ),
    );

    const res = await client.broadcast({
      messages: [{ type: "text", text: "Hello, world!" }],
    });
    deepEqual(res, {});
  });

  it("broadcast with x-line-retry-key", async () => {
    server.use(
      http.post(
        "https://api.line.me/v2/bot/message/broadcast",
        ({ request }) => {
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          equal(
            request.headers.get("x-line-retry-key"),
            "f03c3eb4-0267-4080-9e65-fffa184e1933",
          );
          return HttpResponse.json({});
        },
      ),
    );

    const res = await client.broadcast(
      { messages: [{ type: "text", text: "Hello, world!" }] },
      "f03c3eb4-0267-4080-9e65-fffa184e1933",
    );
    deepEqual(res, {});
  });

  it("getAggregationUnitNameList", async () => {
    server.use(
      http.get(
        "https://api.line.me/v2/bot/message/aggregation/list",
        ({ request }) => {
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          return HttpResponse.json({
            customAggregationUnits: ["unit1", "unit2"],
            next: "token",
          });
        },
      ),
    );

    const res = await client.getAggregationUnitNameList();
    deepEqual(res.customAggregationUnits, ["unit1", "unit2"]);
    equal(res.next, "token");
  });

  it("linkRichMenuIdToUser", async () => {
    let capturedUrl: string | undefined;
    server.use(
      http.post(
        "https://api.line.me/v2/bot/user/:userId/richmenu/:richMenuId",
        ({ request, params }) => {
          capturedUrl = request.url;
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          equal(params.userId, "U1234567890");
          equal(params.richMenuId, "richmenu-1234567890-bba-222");
          return HttpResponse.json({});
        },
      ),
    );

    const res = await client.linkRichMenuIdToUser(
      "U1234567890",
      "richmenu-1234567890-bba-222",
    );
    deepEqual(res, {});
    // Verify both path parameters are correctly interpolated
    equal(capturedUrl?.includes("/U1234567890/"), true);
    equal(capturedUrl?.includes("/richmenu-1234567890-bba-222"), true);
  });

  it("pushMessage with x-line-retry-key header success", async () => {
    server.use(
      http.post("https://api.line.me/v2/bot/message/push", ({ request }) => {
        equal(
          request.headers.get("Authorization"),
          "Bearer test_channel_access_token",
        );
        equal(
          request.headers.get("x-line-retry-key"),
          "f03c3eb4-0267-4080-9e65-fffa184e1933",
        );
        return HttpResponse.json({
          sentMessages: [
            { id: "461230966842064897", quoteToken: "IStG5h1Tz7b..." },
          ],
        });
      }),
    );

    const res = await client.pushMessage(
      {
        to: "USER_ID",
        messages: [{ type: "text", text: "Hello, world!" }],
      },
      "f03c3eb4-0267-4080-9e65-fffa184e1933",
    );
    deepEqual(res, {
      sentMessages: [
        { id: "461230966842064897", quoteToken: "IStG5h1Tz7b..." },
      ],
    });
  });

  it("pushMessage with x-line-retry-key header conflicted (409)", async () => {
    server.use(
      http.post("https://api.line.me/v2/bot/message/push", ({ request }) => {
        equal(
          request.headers.get("x-line-retry-key"),
          "2a6e07b0-0fcf-439f-908b-828ed527e882",
        );
        return HttpResponse.json(
          {
            message: "The retry key is already accepted",
            sentMessages: [
              { id: "461230966842064897", quoteToken: "IStG5h1Tz7b..." },
            ],
          },
          {
            status: 409,
            headers: {
              "x-line-request-id": "3a785346-2cf3-482f-8469-c893117fcef8",
              "x-line-accepted-request-id":
                "4a6e07b0-0fcf-439f-908b-828ed527e882",
            },
          },
        );
      }),
    );

    try {
      await client.pushMessageWithHttpInfo(
        {
          to: "USER_ID",
          messages: [{ type: "text", text: "Hello, world!" }],
        },
        "2a6e07b0-0fcf-439f-908b-828ed527e882",
      );
      throw new Error("should have thrown");
    } catch (e: any) {
      equal(e.status, 409);
      const body = JSON.parse(e.body);
      equal(body.message, "The retry key is already accepted");
    }
  });

  it("broadcast with x-line-retry-key header conflicted (409)", async () => {
    server.use(
      http.post(
        "https://api.line.me/v2/bot/message/broadcast",
        ({ request }) => {
          equal(
            request.headers.get("x-line-retry-key"),
            "2a6e07b0-0fcf-439f-908b-828ed527e882",
          );
          return HttpResponse.json(
            { message: "The retry key is already accepted" },
            {
              status: 409,
              headers: {
                "x-line-request-id": "3a785346-2cf3-482f-8469-c893117fcef8",
                "x-line-accepted-request-id":
                  "4a6e07b0-0fcf-439f-908b-828ed527e882",
              },
            },
          );
        },
      ),
    );

    try {
      await client.broadcastWithHttpInfo(
        { messages: [{ type: "text", text: "Hello, world!" }] },
        "2a6e07b0-0fcf-439f-908b-828ed527e882",
      );
      throw new Error("should have thrown");
    } catch (e: any) {
      equal(e.status, 409);
      const body = JSON.parse(e.body);
      equal(body.message, "The retry key is already accepted");
    }
  });

  it("closeCoupon", async () => {
    let capturedMethod: string | undefined;
    server.use(
      http.put(
        "https://api.line.me/v2/bot/coupon/01JWZKMV.../close",
        ({ request }) => {
          capturedMethod = request.method;
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          return HttpResponse.json({});
        },
      ),
    );

    const res = await client.closeCoupon("01JWZKMV...");
    deepEqual(res, {});
    equal(capturedMethod, "PUT");
  });

  it("getCouponDetail", async () => {
    server.use(
      http.get(
        "https://api.line.me/v2/bot/coupon/01JWZKMV...",
        ({ request }) => {
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          return HttpResponse.json({
            couponId: "01JWZKMV...",
            title: "100Yen OFF",
            startTimestamp: 1751619750,
            endTimestamp: 1751619751,
            visibility: "PUBLIC",
            maxUseCountPerTicket: 1,
            timezone: "ASIA_TOKYO",
            reward: {
              type: "discount",
              priceInfo: {
                type: "fixed",
                fixedAmount: 100,
                currency: "JPY",
              },
            },
            acquisitionCondition: {
              type: "lottery",
              lotteryProbability: 50,
              maxAcquireCount: 1,
            },
            status: "RUNNING",
            createdTimestamp: 1751609750,
          });
        },
      ),
    );

    const res = await client.getCouponDetail("01JWZKMV...");
    equal(res.couponId, "01JWZKMV...");
    equal(res.title, "100Yen OFF");
    equal(res.startTimestamp, 1751619750);
    equal(res.visibility, "PUBLIC");
    equal(res.reward.type, "discount");
    equal(res.status, "RUNNING");
  });

  it("createCoupon", async () => {
    server.use(
      http.post("https://api.line.me/v2/bot/coupon", async ({ request }) => {
        equal(
          request.headers.get("Authorization"),
          "Bearer test_channel_access_token",
        );
        const body = await request.json();
        equal(body.title, "100Yen OFF");
        equal(body.startTimestamp, 1751619750);
        equal(body.reward.type, "discount");
        return HttpResponse.json({ couponId: "01JWZKMV..." });
      }),
    );

    const res = await client.createCoupon({
      title: "100Yen OFF",
      startTimestamp: 1751619750,
      endTimestamp: 1751619751,
      visibility: "PUBLIC",
      maxUseCountPerTicket: 1,
      timezone: "ASIA_TOKYO",
      reward: {
        type: "discount",
        priceInfo: {
          type: "fixed",
          fixedAmount: 100,
        },
      },
      acquisitionCondition: {
        type: "lottery",
        lotteryProbability: 50,
        maxAcquireCount: 1,
      },
    });
    equal(res.couponId, "01JWZKMV...");
  });

  it("pushMessage with textV2 substitution", async () => {
    server.use(
      http.post(
        "https://api.line.me/v2/bot/message/push",
        async ({ request }) => {
          const body = await request.json();
          equal(body.messages[0].type, "textV2");
          equal(body.messages[0].text, " Hello, world! {user_name} san!");
          equal(body.messages[0].substitution.user_name.type, "mention");
          equal(
            body.messages[0].substitution.user_name.mentionee.userId,
            "U1234567890",
          );
          return HttpResponse.json({
            sentMessages: [
              { id: "461230966842064897", quoteToken: "IStG5h1Tz7b..." },
            ],
          });
        },
      ),
    );

    const res = await client.pushMessage({
      to: "USER_ID",
      messages: [
        {
          type: "textV2",
          text: " Hello, world! {user_name} san!",
          substitution: {
            user_name: {
              type: "mention",
              mentionee: {
                type: "user",
                userId: "U1234567890",
              },
            },
          },
        },
      ],
    });
    equal(res.sentMessages[0].id, "461230966842064897");
  });

  it("pushMessage with coupon message", async () => {
    server.use(
      http.post(
        "https://api.line.me/v2/bot/message/push",
        async ({ request }) => {
          const body = await request.json();
          equal(body.messages[0].type, "coupon");
          equal(body.messages[0].couponId, "COUPON_ID_1");
          return HttpResponse.json({
            sentMessages: [
              { id: "461230966842064897", quoteToken: "IStG5h1Tz7b..." },
            ],
          });
        },
      ),
    );

    const res = await client.pushMessage({
      to: "USER_ID",
      messages: [
        {
          type: "coupon",
          couponId: "COUPON_ID_1",
        },
      ],
    });
    equal(res.sentMessages[0].id, "461230966842064897");
  });

  it("pushMessage with custom aggregation unit containing underscore", async () => {
    server.use(
      http.post(
        "https://api.line.me/v2/bot/message/push",
        async ({ request }) => {
          const body = await request.json();
          equal(body.messages[0].type, "text");
          deepEqual(body.messages[0].customAggregationUnits, ["aa_bb_11"]);
          return HttpResponse.json({
            sentMessages: [
              { id: "461230966842064897", quoteToken: "IStG5h1Tz7b..." },
            ],
          });
        },
      ),
    );

    const res = await client.pushMessage({
      to: "USER_ID",
      messages: [
        {
          type: "text",
          text: " Hello, world! b_a san!",
          customAggregationUnits: ["aa_bb_11"],
        },
      ],
    });
    equal(res.sentMessages[0].id, "461230966842064897");
  });

  it("broadcast with DatetimePickerAction", async () => {
    server.use(
      http.post(
        "https://api.line.me/v2/bot/message/broadcast",
        async ({ request }) => {
          const body = await request.json();
          const action = body.messages[0].quickReply.items[0].action;
          equal(action.type, "datetimepicker");
          equal(action.data, "some_data");
          equal(action.mode, "datetime");
          return HttpResponse.json({});
        },
      ),
    );

    const res = await client.broadcast({
      messages: [
        {
          type: "text",
          text: "Please pick a date/time!",
          quickReply: {
            items: [
              {
                type: "action",
                action: {
                  type: "datetimepicker",
                  data: "some_data",
                  mode: "datetime",
                  label: "Pick",
                },
              },
            ],
          },
        },
      ],
    });
    deepEqual(res, {});
  });

  it("broadcast with ImageCarouselTemplate", async () => {
    server.use(
      http.post(
        "https://api.line.me/v2/bot/message/broadcast",
        async ({ request }) => {
          const body = await request.json();
          equal(body.messages[0].type, "template");
          equal(body.messages[0].template.type, "image_carousel");
          equal(body.messages[0].template.columns.length, 2);
          equal(body.messages[0].template.columns[0].action.type, "uri");
          return HttpResponse.json({});
        },
      ),
    );

    const res = await client.broadcast({
      messages: [
        {
          type: "template",
          altText: "This is an Image Carousel",
          template: {
            type: "image_carousel",
            columns: [
              {
                imageUrl: "https://example.com/image1.png",
                action: {
                  type: "uri",
                  uri: "https://example.com",
                  label: "Go",
                },
              },
              {
                imageUrl: "https://example.com/image2.png",
                action: {
                  type: "message",
                  text: "Hello!",
                  label: "Say Hello",
                },
              },
            ],
          },
        },
      ],
    });
    deepEqual(res, {});
  });

  it("broadcast with FlexMessage simple flex text", async () => {
    server.use(
      http.post(
        "https://api.line.me/v2/bot/message/broadcast",
        async ({ request }) => {
          const body = await request.json();
          equal(body.messages[0].type, "flex");
          equal(body.messages[0].altText, "Test Alt Text");
          equal(body.messages[0].contents.type, "bubble");
          equal(body.messages[0].contents.direction, "ltr");
          equal(body.messages[0].contents.body.type, "box");
          equal(body.messages[0].contents.body.layout, "vertical");
          equal(body.messages[0].contents.body.contents[0].text, "Test Text");
          equal(body.messages[0].contents.body.contents[0].weight, "bold");
          return HttpResponse.json({});
        },
      ),
    );

    const res = await client.broadcast({
      messages: [
        {
          type: "flex",
          altText: "Test Alt Text",
          contents: {
            type: "bubble",
            direction: "ltr",
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: "Test Text",
                  weight: "bold",
                },
              ],
            },
          },
        },
      ],
    });
    deepEqual(res, {});
  });

  it("broadcast with FlexBoxLinearGradient", async () => {
    server.use(
      http.post(
        "https://api.line.me/v2/bot/message/broadcast",
        async ({ request }) => {
          const body = await request.json();
          const bg = body.messages[0].contents.body.background;
          equal(bg.type, "linearGradient");
          equal(bg.angle, "90deg");
          equal(bg.startColor, "#FF0000");
          equal(bg.endColor, "#0000FF");
          return HttpResponse.json({});
        },
      ),
    );

    const res = await client.broadcast({
      messages: [
        {
          type: "flex",
          altText: "Test FlexBox with LinearGradient",
          contents: {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              contents: [{ type: "text", text: "Hello World!" }],
              background: {
                type: "linearGradient",
                angle: "90deg",
                startColor: "#FF0000",
                endColor: "#0000FF",
              },
            },
          },
        },
      ],
    });
    deepEqual(res, {});
  });

  it("broadcast with FlexMessage does not drop empty array", async () => {
    server.use(
      http.post(
        "https://api.line.me/v2/bot/message/broadcast",
        async ({ request }) => {
          const body = await request.json();
          const innerBox = body.messages[0].contents.body.contents[2];
          equal(innerBox.type, "box");
          deepEqual(innerBox.contents, []);
          equal(innerBox.width, "30px");
          equal(innerBox.background.type, "linearGradient");
          return HttpResponse.json({});
        },
      ),
    );

    const res = await client.broadcast({
      messages: [
        {
          type: "flex",
          altText: "Test Alt Text",
          contents: {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                { type: "text", text: "Test Text", weight: "bold" },
                {
                  type: "image",
                  url: "https://example.com/flex/images/image.jpg",
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [],
                  width: "30px",
                  height: "30px",
                  background: {
                    type: "linearGradient",
                    angle: "90deg",
                    startColor: "#FFFF00",
                    endColor: "#0080ff",
                  },
                },
              ],
            },
          },
        },
      ],
    });
    deepEqual(res, {});
  });

  it("replyMessage handles unknown fields in response", async () => {
    server.use(
      http.post(
        "https://api.line.me/v2/bot/message/reply",
        async ({ request }) => {
          return HttpResponse.json({
            sentMessages: [
              { id: "461230966842064897", quoteToken: "IStG5h1Tz7b..." },
            ],
            invalidField: "foobar",
          });
        },
      ),
    );

    const res = await client.replyMessage({
      replyToken: "test-reply-token",
      messages: [{ type: "text", text: "Hello, world!" }],
    });
    equal(res.sentMessages[0].id, "461230966842064897");
    // unknown fields should be preserved in the response object
    equal((res as any).invalidField, "foobar");
  });

  it("allow to change baseURL in normal client", async () => {
    const customClient = new messagingApi.MessagingApiClient({
      channelAccessToken: "test_channel_access_token",
      baseURL: "https://example.com",
    });

    server.use(
      http.get(
        "https://example.com/v2/bot/profile/u1234567890",
        ({ request }) => {
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          return HttpResponse.json({
            displayName: "LINE taro",
            userId: "u1234567890",
          });
        },
      ),
    );

    const res = await customClient.getProfile("u1234567890");
    equal(res.userId, "u1234567890");
  });

  it("allow to change baseURL in blob client", async () => {
    const customBlobClient = new messagingApi.MessagingApiBlobClient({
      channelAccessToken: "test_channel_access_token",
      baseURL: "https://example.com",
    });

    server.use(
      http.get(
        "https://example.com/v2/bot/message/test-message-id/content/transcoding",
        ({ request }) => {
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          return HttpResponse.json({ status: "succeeded" });
        },
      ),
    );

    const res =
      await customBlobClient.getMessageContentTranscodingByMessageId(
        "test-message-id",
      );
    equal(res.status, "succeeded");
  });

  it("broadcast with RichMenuSwitchAction", async () => {
    server.use(
      http.post(
        "https://api.line.me/v2/bot/message/broadcast",
        async ({ request }) => {
          const body = await request.json();
          const action = body.messages[0].contents.body.contents[0].action;
          equal(action.type, "richmenuswitch");
          equal(action.data, "switch_richmenu");
          equal(action.richMenuAliasId, "alias_xxx");
          return HttpResponse.json({});
        },
      ),
    );

    const res = await client.broadcast({
      messages: [
        {
          type: "flex",
          altText: "Switch RichMenu",
          contents: {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "button",
                  action: {
                    type: "richmenuswitch",
                    data: "switch_richmenu",
                    richMenuAliasId: "alias_xxx",
                    label: "Switch Menu",
                  },
                },
              ],
            },
          },
        },
      ],
    });
    deepEqual(res, {});
  });
});
