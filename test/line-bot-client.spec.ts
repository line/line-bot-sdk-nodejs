import { LineBotClient } from "../lib/index.js";
import { createLineBotClientForTest } from "../lib/line-bot-client.js";
import type { LineBotClientDelegates } from "../lib/line-bot-client.generated.js";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal, ok } from "node:assert";
import { describe, it, beforeAll, afterAll, afterEach } from "vitest";

const channelAccessToken = "test_channel_access_token";

describe("LineBotClient", () => {
  const server = setupServer();
  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  describe("create", () => {
    it("returns a LineBotClient instance", () => {
      const client = LineBotClient.create({ channelAccessToken });
      ok(client instanceof LineBotClient);
    });

    it("accepts delegate overrides via createLineBotClientForTest", async () => {
      let called = false;
      const mockDelegates: Partial<LineBotClientDelegates> = {
        messagingApi: {
          pushMessage: async () => {
            called = true;
            return {};
          },
        } as unknown as LineBotClientDelegates["messagingApi"],
      };

      const client = createLineBotClientForTest(
        { channelAccessToken },
        mockDelegates,
      );
      await client.pushMessage({
        to: "U123",
        messages: [{ type: "text", text: "hi" }],
      });
      ok(called);
    });
  });

  describe("delegation", () => {
    it("delegates getNumberOfFollowers to insight client", async () => {
      const client = LineBotClient.create({ channelAccessToken });
      let requestCount = 0;
      server.use(
        http.get(
          "https://api.line.me/v2/bot/insight/followers",
          ({ request }) => {
            requestCount++;
            equal(
              request.headers.get("Authorization"),
              "Bearer test_channel_access_token",
            );
            const url = new URL(request.url);
            equal(url.searchParams.get("date"), "20240101");
            return HttpResponse.json({ followers: 100 });
          },
        ),
      );

      const res = await client.getNumberOfFollowers("20240101");
      equal(requestCount, 1);
      deepEqual(res, { followers: 100 });
    });

    it("delegates getAllLIFFApps to liff client", async () => {
      const client = LineBotClient.create({ channelAccessToken });
      let requestCount = 0;
      server.use(
        http.get("https://api.line.me/liff/v1/apps", ({ request }) => {
          requestCount++;
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          return HttpResponse.json({ apps: [] });
        }),
      );

      const res = await client.getAllLIFFApps();
      equal(requestCount, 1);
      deepEqual(res, { apps: [] });
    });

    it("delegates deleteAudienceGroup to manageAudience client", async () => {
      const client = LineBotClient.create({ channelAccessToken });
      let requestCount = 0;
      server.use(
        http.delete(
          "https://api.line.me/v2/bot/audienceGroup/12345",
          ({ request }) => {
            requestCount++;
            equal(
              request.headers.get("Authorization"),
              "Bearer test_channel_access_token",
            );
            return HttpResponse.json({});
          },
        ),
      );

      const res = await client.deleteAudienceGroup(12345);
      equal(requestCount, 1);
      deepEqual(res, {});
    });

    it("delegates createAudienceForUploadingUserIds to manageAudienceBlob client", async () => {
      const client = LineBotClient.create({ channelAccessToken });
      let requestCount = 0;
      server.use(
        http.post(
          "https://api-data.line.me/v2/bot/audienceGroup/upload/byFile",
          ({ request }) => {
            requestCount++;
            equal(
              request.headers.get("Authorization"),
              "Bearer test_channel_access_token",
            );
            return HttpResponse.json({ audienceGroupId: 1 });
          },
        ),
      );

      const res = await client.createAudienceForUploadingUserIds(
        new Blob(["user_id_1"], { type: "text/plain" }),
        "test audience",
      );
      equal(requestCount, 1);
      deepEqual(res, { audienceGroupId: 1 });
    });

    it("delegates pushMessage to messagingApi client", async () => {
      const client = LineBotClient.create({ channelAccessToken });
      let requestCount = 0;
      server.use(
        http.post("https://api.line.me/v2/bot/message/push", ({ request }) => {
          requestCount++;
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          return HttpResponse.json({});
        }),
      );

      const res = await client.pushMessage({
        to: "uAAAAAAAAAAAAA",
        messages: [{ type: "text", text: "hello" }],
      });
      equal(requestCount, 1);
      deepEqual(res, {});
    });

    it("delegates getFollowers to messagingApi client with query params", async () => {
      const client = LineBotClient.create({ channelAccessToken });
      let requestCount = 0;
      server.use(
        http.get("https://api.line.me/v2/bot/followers/ids", ({ request }) => {
          requestCount++;
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          const url = new URL(request.url);
          equal(url.searchParams.get("start"), "xBQU2IB");
          equal(url.searchParams.get("limit"), "100");
          return HttpResponse.json({ userIds: ["UAAA"], next: "yANU9IA.." });
        }),
      );

      const res = await client.getFollowers("xBQU2IB", 100);
      equal(requestCount, 1);
      deepEqual(res, { userIds: ["UAAA"], next: "yANU9IA.." });
    });

    it("delegates getFollowers without start parameter", async () => {
      const client = LineBotClient.create({ channelAccessToken });
      let requestCount = 0;
      server.use(
        http.get("https://api.line.me/v2/bot/followers/ids", ({ request }) => {
          requestCount++;
          const url = new URL(request.url);
          equal(url.searchParams.has("start"), false);
          equal(url.searchParams.get("limit"), "100");
          return HttpResponse.json({ userIds: ["UAAA"] });
        }),
      );

      await client.getFollowers(undefined, 100);
      equal(requestCount, 1);
    });

    it("delegates getMessageContent to messagingApiBlob client", async () => {
      const client = LineBotClient.create({ channelAccessToken });
      let requestCount = 0;
      server.use(
        http.get(
          "https://api-data.line.me/v2/bot/message/msg123/content",
          ({ request }) => {
            requestCount++;
            equal(
              request.headers.get("Authorization"),
              "Bearer test_channel_access_token",
            );
            return HttpResponse.text("binary-content");
          },
        ),
      );

      await client.getMessageContent("msg123");
      equal(requestCount, 1);
    });

    it("delegates getModules to lineModule client", async () => {
      const client = LineBotClient.create({ channelAccessToken });
      let requestCount = 0;
      server.use(
        http.get("https://api.line.me/v2/bot/list", ({ request }) => {
          requestCount++;
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          return HttpResponse.json({ bots: [] });
        }),
      );

      const res = await client.getModules();
      equal(requestCount, 1);
      deepEqual(res, { bots: [] });
    });

    it("delegates attachModule to lineModuleAttach client", async () => {
      const client = LineBotClient.create({ channelAccessToken });
      let requestCount = 0;
      server.use(
        http.post(
          "https://manager.line.biz/module/auth/v1/token",
          async ({ request }) => {
            requestCount++;
            const body = await request.text();
            ok(body.includes("grant_type=authorization_code"));
            return HttpResponse.json({ access_token: "module_token" });
          },
        ),
      );

      const res = await client.attachModule(
        "authorization_code",
        "auth_code",
        "https://example.com/callback",
      );
      equal(requestCount, 1);
      deepEqual(res, { access_token: "module_token" });
    });

    it("delegates missionStickerV3 to shop client", async () => {
      const client = LineBotClient.create({ channelAccessToken });
      let requestCount = 0;
      server.use(
        http.post("https://api.line.me/shop/v3/mission", ({ request }) => {
          requestCount++;
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          return HttpResponse.json({});
        }),
      );

      const res = await client.missionStickerV3({
        to: "U4af4980629",
        productId: "prod_id",
        productType: "prod_type",
        sendPresentMessage: false,
      });
      equal(requestCount, 1);
      deepEqual(res, {});
    });
  });

  describe("config", () => {
    it("passes channelAccessToken as Authorization header", async () => {
      const client = LineBotClient.create({
        channelAccessToken: "my_token",
      });
      let capturedAuth: string | null = null;
      server.use(
        http.post("https://api.line.me/v2/bot/message/push", ({ request }) => {
          capturedAuth = request.headers.get("Authorization");
          return HttpResponse.json({});
        }),
      );

      await client.pushMessage({
        to: "U123",
        messages: [{ type: "text", text: "hi" }],
      });
      equal(capturedAuth, "Bearer my_token");
    });

    it("passes xLineRetryKey as X-Line-Retry-Key header", async () => {
      const client = LineBotClient.create({ channelAccessToken });
      let capturedRetryKey: string | null = null;
      server.use(
        http.post("https://api.line.me/v2/bot/message/push", ({ request }) => {
          capturedRetryKey = request.headers.get("X-Line-Retry-Key");
          return HttpResponse.json({});
        }),
      );

      await client.pushMessage(
        { to: "U123", messages: [{ type: "text", text: "hi" }] },
        "KEYKEYKEYKEY",
      );
      equal(capturedRetryKey, "KEYKEYKEYKEY");
    });

    it("omits X-Line-Retry-Key header when xLineRetryKey is not given", async () => {
      const client = LineBotClient.create({ channelAccessToken });
      let capturedRetryKey: string | null | undefined = "SENTINEL";
      server.use(
        http.post("https://api.line.me/v2/bot/message/push", ({ request }) => {
          capturedRetryKey = request.headers.get("X-Line-Retry-Key");
          return HttpResponse.json({});
        }),
      );

      await client.pushMessage(
        { to: "U123", messages: [{ type: "text", text: "hi" }] },
        undefined,
      );
      equal(capturedRetryKey, null);
    });

    it("passes defaultHeaders to delegates", async () => {
      const client = LineBotClient.create({
        channelAccessToken,
        defaultHeaders: { "x-custom-header": "custom_value" },
      });
      let capturedHeader: string | null = null;
      server.use(
        http.post("https://api.line.me/v2/bot/message/push", ({ request }) => {
          capturedHeader = request.headers.get("x-custom-header");
          return HttpResponse.json({});
        }),
      );

      await client.pushMessage({
        to: "U123",
        messages: [{ type: "text", text: "hi" }],
      });
      equal(capturedHeader, "custom_value");
    });

    it("uses custom apiBaseURL for api.line.me clients", async () => {
      const client = LineBotClient.create({
        channelAccessToken,
        apiBaseURL: "https://custom-api.example.com",
      });
      let requestCount = 0;
      server.use(
        http.post("https://custom-api.example.com/v2/bot/message/push", () => {
          requestCount++;
          return HttpResponse.json({});
        }),
      );

      await client.pushMessage({
        to: "U123",
        messages: [{ type: "text", text: "hi" }],
      });
      equal(requestCount, 1);
    });

    it("uses custom dataApiBaseURL for api-data.line.me clients", async () => {
      const client = LineBotClient.create({
        channelAccessToken,
        dataApiBaseURL: "https://custom-data.example.com",
      });
      let requestCount = 0;
      server.use(
        http.get(
          "https://custom-data.example.com/v2/bot/message/msg456/content",
          () => {
            requestCount++;
            return HttpResponse.text("data");
          },
        ),
      );

      await client.getMessageContent("msg456");
      equal(requestCount, 1);
    });

    it("uses custom managerBaseURL for manager.line.biz clients", async () => {
      const client = LineBotClient.create({
        channelAccessToken,
        managerBaseURL: "https://custom-manager.example.com",
      });
      let requestCount = 0;
      server.use(
        http.post(
          "https://custom-manager.example.com/module/auth/v1/token",
          () => {
            requestCount++;
            return HttpResponse.json({ access_token: "t" });
          },
        ),
      );

      await client.attachModule(
        "authorization_code",
        "code",
        "https://example.com/cb",
      );
      equal(requestCount, 1);
    });
  });

  describe("delegateOverrides", () => {
    it("uses provided delegate instead of default", async () => {
      let called = false;
      const mockMessagingApi = {
        pushMessage: async () => {
          called = true;
          return { sentMessages: [] };
        },
      } as unknown as LineBotClientDelegates["messagingApi"];

      const client = createLineBotClientForTest(
        { channelAccessToken },
        { messagingApi: mockMessagingApi },
      );

      const res = await client.pushMessage({
        to: "U123",
        messages: [{ type: "text", text: "hi" }],
      });
      ok(called, "overridden delegate should have been called");
      deepEqual(res, { sentMessages: [] });
    });

    it("leaves non-overridden delegates using default clients", async () => {
      const mockShop = {
        missionStickerV3: async () => ({ overridden: true }),
      } as unknown as LineBotClientDelegates["shop"];

      const client = createLineBotClientForTest(
        { channelAccessToken },
        { shop: mockShop },
      );

      // messagingApi is NOT overridden — it should still hit the real HTTP client
      let requestCount = 0;
      server.use(
        http.post("https://api.line.me/v2/bot/message/push", () => {
          requestCount++;
          return HttpResponse.json({});
        }),
      );

      await client.pushMessage({
        to: "U123",
        messages: [{ type: "text", text: "hi" }],
      });
      equal(requestCount, 1);

      // shop IS overridden — no HTTP request expected
      const shopRes = await client.missionStickerV3({
        to: "U123",
        productId: "p",
        productType: "t",
        sendPresentMessage: false,
      });
      deepEqual(shopRes, { overridden: true });
    });
  });
});
