import { messagingApi } from "../lib/index.js";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal } from "node:assert";
import { rejects } from "node:assert/strict";

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

  it("encodes path parameter slash for profile endpoint", async () => {
    let requestCount = 0;
    server.use(
      http.get(
        "https://api.line.me/v2/bot/profile/..%2Falice",
        ({ request, params, cookies }) => {
          requestCount++;

          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          return HttpResponse.json({});
        },
      ),
    );

    const res = await client.getProfileWithHttpInfo("../alice");
    equal(requestCount, 1);
    deepEqual(res.body, {});
  });

  it("treats encoded dot sequence as data for profile endpoint", async () => {
    let requestCount = 0;
    server.use(
      http.get(
        "https://api.line.me/v2/bot/profile/%252e%252e%2Fmessage%2Fquota",
        ({ request, params, cookies }) => {
          requestCount++;

          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          return HttpResponse.json({});
        },
      ),
    );

    const res = await client.getProfileWithHttpInfo("%2e%2e/message/quota");
    equal(requestCount, 1);
    deepEqual(res.body, {});
  });

  it("encodes path parameters for multi-path endpoint", async () => {
    let requestCount = 0;
    server.use(
      http.get(
        "https://api.line.me/v2/bot/group/..%2Fgroup/member/user%2F42",
        ({ request, params, cookies }) => {
          requestCount++;

          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          return HttpResponse.json({});
        },
      ),
    );

    const res = await client.getGroupMemberProfileWithHttpInfo(
      "../group",
      "user/42",
    );
    equal(requestCount, 1);
    deepEqual(res.body, {});
  });

  it("rejects dot segments for profile endpoint path parameter", async () => {
    const localClient = new messagingApi.MessagingApiClient({
      channelAccessToken,
      baseURL: "http://127.0.0.1:1",
    });

    for (const userId of [".", ".."]) {
      await rejects(localClient.getProfileWithHttpInfo(userId), {
        name: "TypeError",
        message: `Path parameters shouldn't perform path traversal ('.' or '..'): /v2/bot/profile/${userId}`,
      });
    }
  });

  it("rejects dot segments for multi-path endpoint path parameter", async () => {
    const localClient = new messagingApi.MessagingApiClient({
      channelAccessToken,
      baseURL: "http://127.0.0.1:1",
    });

    await rejects(localClient.getGroupMemberProfileWithHttpInfo(".", "user"), {
      name: "TypeError",
      message: `Path parameters shouldn't perform path traversal ('.' or '..'): /v2/bot/group/./member/user`,
    });
    await rejects(
      localClient.getGroupMemberProfileWithHttpInfo("group", ".."),
      {
        name: "TypeError",
        message: `Path parameters shouldn't perform path traversal ('.' or '..'): /v2/bot/group/group/member/..`,
      },
    );
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
});
