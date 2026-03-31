import { LineBotClient, HTTPFetchError } from "../lib";
import { Buffer } from "node:buffer";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal, match, ok } from "node:assert";
import { describe, it, beforeAll, afterAll, afterEach } from "vitest";

const channelAccessToken = "test_channel_access_token";

function createPushMessageRequest(text = "hi") {
  return {
    to: "U123",
    messages: [{ type: "text" as const, text }],
  };
}

async function readToString(
  stream: AsyncIterable<Uint8Array>,
): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

describe("LineBotClient", () => {
  const server = setupServer();

  beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  describe("create", () => {
    it("returns a LineBotClient instance", () => {
      const client = LineBotClient.create({ channelAccessToken });
      ok(client instanceof LineBotClient);
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
            const contentType = request.headers.get("content-type");
            ok(contentType);
            match(contentType!, /^multipart\/form-data; boundary=.*$/);
            return HttpResponse.json({ audienceGroupId: 1 });
          },
        ),
      );

      const res = await client.createAudienceForUploadingUserIds(
        new Blob(["user_id_1"], { type: "text/plain" }),
        "test audience",
        true,
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

      const res = await client.pushMessage(createPushMessageRequest("hello"));
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

      const res = await client.getFollowers(undefined, 100);
      equal(requestCount, 1);
      deepEqual(res, { userIds: ["UAAA"] });
    });

    it("delegates getMessageContent to messagingApiBlob client and returns a readable body", async () => {
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

      const stream = await client.getMessageContent("msg123");
      const body = await readToString(stream);
      equal(requestCount, 1);
      equal(body, "binary-content");
    });

    it("delegates getMessageContentTranscodingByMessageId to messagingApiBlob client", async () => {
      const client = LineBotClient.create({ channelAccessToken });
      let requestCount = 0;

      server.use(
        http.get(
          "https://api-data.line.me/v2/bot/message/msg123/content/transcoding",
          ({ request }) => {
            requestCount++;
            equal(
              request.headers.get("Authorization"),
              "Bearer test_channel_access_token",
            );
            return HttpResponse.json({ status: "succeeded" });
          },
        ),
      );

      const res =
        await client.getMessageContentTranscodingByMessageId("msg123");
      equal(requestCount, 1);
      deepEqual(res, { status: "succeeded" });
    });

    it("delegates setRichMenuImage to messagingApiBlob client", async () => {
      const client = LineBotClient.create({ channelAccessToken });
      const image = new Blob(["png-binary"], { type: "image/png" });
      let requestCount = 0;

      server.use(
        http.post(
          "https://api-data.line.me/v2/bot/richmenu/richmenu-123/content",
          async ({ request }) => {
            requestCount++;
            equal(
              request.headers.get("Authorization"),
              "Bearer test_channel_access_token",
            );
            equal(request.headers.get("content-type"), "image/png");
            const body = await request.arrayBuffer();
            equal(body.byteLength, image.size);
            return HttpResponse.json({ uploaded: true });
          },
        ),
      );

      const res = await client.setRichMenuImage("richmenu-123", image);
      equal(requestCount, 1);
      deepEqual(res, { uploaded: true });
    });

    it("delegates getModules to lineModule client with query params", async () => {
      const client = LineBotClient.create({ channelAccessToken });
      let requestCount = 0;

      server.use(
        http.get("https://api.line.me/v2/bot/list", ({ request }) => {
          requestCount++;
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          const url = new URL(request.url);
          equal(url.searchParams.get("start"), "next-token");
          equal(url.searchParams.get("limit"), "20");
          return HttpResponse.json({
            bots: [{ userId: "U111", basicId: "@bot" }],
            next: "next-next-token",
          });
        }),
      );

      const res = await client.getModules("next-token", 20);
      equal(requestCount, 1);
      deepEqual(res, {
        bots: [{ userId: "U111", basicId: "@bot" }],
        next: "next-next-token",
      });
    });

    it("delegates getModules without start parameter", async () => {
      const client = LineBotClient.create({ channelAccessToken });
      let requestCount = 0;

      server.use(
        http.get("https://api.line.me/v2/bot/list", ({ request }) => {
          requestCount++;
          const url = new URL(request.url);
          equal(url.searchParams.has("start"), false);
          equal(url.searchParams.get("limit"), "25");
          return HttpResponse.json({ bots: [] });
        }),
      );

      const res = await client.getModules(undefined, 25);
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
            equal(
              request.headers.get("Authorization"),
              "Bearer test_channel_access_token",
            );
            const contentType = request.headers.get("content-type");
            ok(contentType);
            match(contentType!, /^application\/x-www-form-urlencoded/);
            const params = new URLSearchParams(await request.text());
            equal(params.get("grant_type"), "authorization_code");
            equal(params.get("code"), "auth_code");
            equal(params.get("redirect_uri"), "https://example.com/callback");
            equal(params.has("client_id"), false);
            equal(params.has("client_secret"), false);
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

    it("delegates attachModule optional parameters to lineModuleAttach client", async () => {
      const client = LineBotClient.create({ channelAccessToken });
      let requestCount = 0;

      server.use(
        http.post(
          "https://manager.line.biz/module/auth/v1/token",
          async ({ request }) => {
            requestCount++;
            const params = new URLSearchParams(await request.text());
            equal(params.get("grant_type"), "authorization_code");
            equal(params.get("code"), "auth_code");
            equal(params.get("redirect_uri"), "https://example.com/callback");
            equal(params.get("code_verifier"), "code-verifier");
            equal(params.get("client_id"), "module-channel-id");
            equal(params.get("client_secret"), "module-channel-secret");
            equal(params.get("region"), "jp");
            equal(params.get("basic_search_id"), "basic-search-id");
            equal(params.get("scope"), "openid profile");
            equal(params.get("brand_type"), "consumer");
            return HttpResponse.json({ access_token: "module_token" });
          },
        ),
      );

      const res = await client.attachModule(
        "authorization_code",
        "auth_code",
        "https://example.com/callback",
        "code-verifier",
        "module-channel-id",
        "module-channel-secret",
        "jp",
        "basic-search-id",
        "openid profile",
        "consumer",
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
    it("passes channelAccessToken as Authorization header to api.line.me clients", async () => {
      const client = LineBotClient.create({ channelAccessToken: "my_token" });
      let capturedAuth: string | null = null;

      server.use(
        http.post("https://api.line.me/v2/bot/message/push", ({ request }) => {
          capturedAuth = request.headers.get("Authorization");
          return HttpResponse.json({});
        }),
      );

      await client.pushMessage(createPushMessageRequest());
      equal(capturedAuth, "Bearer my_token");
    });

    it("passes channelAccessToken as Authorization header to api-data.line.me clients", async () => {
      const client = LineBotClient.create({ channelAccessToken: "my_token" });
      let capturedAuth: string | null = null;

      server.use(
        http.get(
          "https://api-data.line.me/v2/bot/message/msg-auth/content",
          ({ request }) => {
            capturedAuth = request.headers.get("Authorization");
            return HttpResponse.text("ok");
          },
        ),
      );

      const stream = await client.getMessageContent("msg-auth");
      equal(await readToString(stream), "ok");
      equal(capturedAuth, "Bearer my_token");
    });

    it("passes channelAccessToken as Authorization header to manager.line.biz clients", async () => {
      const client = LineBotClient.create({ channelAccessToken: "my_token" });
      let capturedAuth: string | null = null;

      server.use(
        http.post(
          "https://manager.line.biz/module/auth/v1/token",
          ({ request }) => {
            capturedAuth = request.headers.get("Authorization");
            return HttpResponse.json({ access_token: "t" });
          },
        ),
      );

      await client.attachModule(
        "authorization_code",
        "code",
        "https://example.com/cb",
      );
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

      await client.pushMessage(createPushMessageRequest(), "KEYKEYKEYKEY");
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

      await client.pushMessage(createPushMessageRequest(), undefined);
      equal(capturedRetryKey, null);
    });

    it("passes defaultHeaders to api.line.me clients", async () => {
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

      await client.pushMessage(createPushMessageRequest());
      equal(capturedHeader, "custom_value");
    });

    it("passes defaultHeaders to api-data.line.me clients", async () => {
      const client = LineBotClient.create({
        channelAccessToken,
        defaultHeaders: { "x-custom-header": "custom_value" },
      });
      let capturedHeader: string | null = null;

      server.use(
        http.get(
          "https://api-data.line.me/v2/bot/message/msg-header/content",
          ({ request }) => {
            capturedHeader = request.headers.get("x-custom-header");
            return HttpResponse.text("ok");
          },
        ),
      );

      const stream = await client.getMessageContent("msg-header");
      equal(await readToString(stream), "ok");
      equal(capturedHeader, "custom_value");
    });

    it("passes defaultHeaders to manager.line.biz clients", async () => {
      const client = LineBotClient.create({
        channelAccessToken,
        defaultHeaders: { "x-custom-header": "custom_value" },
      });
      let capturedHeader: string | null = null;

      server.use(
        http.post(
          "https://manager.line.biz/module/auth/v1/token",
          ({ request }) => {
            capturedHeader = request.headers.get("x-custom-header");
            return HttpResponse.json({ access_token: "t" });
          },
        ),
      );

      await client.attachModule(
        "authorization_code",
        "code",
        "https://example.com/cb",
      );
      equal(capturedHeader, "custom_value");
    });

    it("does not allow defaultHeaders.authorization to override api Authorization", async () => {
      const client = LineBotClient.create({
        channelAccessToken,
        defaultHeaders: { authorization: "Bearer overridden" },
      });
      let capturedAuth: string | null = null;

      server.use(
        http.post("https://api.line.me/v2/bot/message/push", ({ request }) => {
          capturedAuth = request.headers.get("Authorization");
          return HttpResponse.json({});
        }),
      );

      await client.pushMessage(createPushMessageRequest());
      equal(capturedAuth, `Bearer ${channelAccessToken}`);
    });

    it("does not allow defaultHeaders.authorization to override data Authorization", async () => {
      const client = LineBotClient.create({
        channelAccessToken,
        defaultHeaders: { authorization: "Bearer overridden" },
      });
      let capturedAuth: string | null = null;

      server.use(
        http.get(
          "https://api-data.line.me/v2/bot/message/msg-auth-override/content",
          ({ request }) => {
            capturedAuth = request.headers.get("Authorization");
            return HttpResponse.text("ok");
          },
        ),
      );

      const stream = await client.getMessageContent("msg-auth-override");
      equal(await readToString(stream), "ok");
      equal(capturedAuth, `Bearer ${channelAccessToken}`);
    });

    it("does not allow defaultHeaders.authorization to override manager Authorization", async () => {
      const client = LineBotClient.create({
        channelAccessToken,
        defaultHeaders: { authorization: "Bearer overridden" },
      });
      let capturedAuth: string | null = null;

      server.use(
        http.post(
          "https://manager.line.biz/module/auth/v1/token",
          ({ request }) => {
            capturedAuth = request.headers.get("Authorization");
            return HttpResponse.json({ access_token: "t" });
          },
        ),
      );

      await client.attachModule(
        "authorization_code",
        "code",
        "https://example.com/cb",
      );
      equal(capturedAuth, `Bearer ${channelAccessToken}`);
    });
  });

  describe("baseURL routing", () => {
    it("uses custom apiBaseURL for insight client", async () => {
      const client = LineBotClient.create({
        channelAccessToken,
        apiBaseURL: "https://custom-api.example.com",
      });
      let requestCount = 0;

      server.use(
        http.get(
          "https://custom-api.example.com/v2/bot/insight/followers",
          () => {
            requestCount++;
            return HttpResponse.json({ followers: 123 });
          },
        ),
      );

      const res = await client.getNumberOfFollowers("20240101");
      equal(requestCount, 1);
      deepEqual(res, { followers: 123 });
    });

    it("uses custom apiBaseURL for liff client", async () => {
      const client = LineBotClient.create({
        channelAccessToken,
        apiBaseURL: "https://custom-api.example.com",
      });
      let requestCount = 0;

      server.use(
        http.get("https://custom-api.example.com/liff/v1/apps", () => {
          requestCount++;
          return HttpResponse.json({ apps: [] });
        }),
      );

      const res = await client.getAllLIFFApps();
      equal(requestCount, 1);
      deepEqual(res, { apps: [] });
    });

    it("uses custom apiBaseURL for manageAudience client", async () => {
      const client = LineBotClient.create({
        channelAccessToken,
        apiBaseURL: "https://custom-api.example.com",
      });
      let requestCount = 0;

      server.use(
        http.delete(
          "https://custom-api.example.com/v2/bot/audienceGroup/999",
          () => {
            requestCount++;
            return HttpResponse.json({});
          },
        ),
      );

      const res = await client.deleteAudienceGroup(999);
      equal(requestCount, 1);
      deepEqual(res, {});
    });

    it("uses custom apiBaseURL for messagingApi client", async () => {
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

      await client.pushMessage(createPushMessageRequest());
      equal(requestCount, 1);
    });

    it("uses custom apiBaseURL for lineModule client", async () => {
      const client = LineBotClient.create({
        channelAccessToken,
        apiBaseURL: "https://custom-api.example.com",
      });
      let requestCount = 0;

      server.use(
        http.get("https://custom-api.example.com/v2/bot/list", () => {
          requestCount++;
          return HttpResponse.json({ bots: [] });
        }),
      );

      const res = await client.getModules();
      equal(requestCount, 1);
      deepEqual(res, { bots: [] });
    });

    it("uses custom apiBaseURL for shop client", async () => {
      const client = LineBotClient.create({
        channelAccessToken,
        apiBaseURL: "https://custom-api.example.com",
      });
      let requestCount = 0;

      server.use(
        http.post("https://custom-api.example.com/shop/v3/mission", () => {
          requestCount++;
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

    it("apiBaseURL does not affect data or manager clients", async () => {
      const client = LineBotClient.create({
        channelAccessToken,
        apiBaseURL: "https://custom-api.example.com",
      });
      let apiCount = 0;
      let dataCount = 0;
      let managerCount = 0;

      server.use(
        http.post("https://custom-api.example.com/v2/bot/message/push", () => {
          apiCount++;
          return HttpResponse.json({});
        }),
        http.get(
          "https://api-data.line.me/v2/bot/message/msg-api-isolation/content",
          () => {
            dataCount++;
            return HttpResponse.text("data");
          },
        ),
        http.post("https://manager.line.biz/module/auth/v1/token", () => {
          managerCount++;
          return HttpResponse.json({ access_token: "t" });
        }),
      );

      await client.pushMessage(createPushMessageRequest());
      equal(
        await readToString(await client.getMessageContent("msg-api-isolation")),
        "data",
      );
      await client.attachModule(
        "authorization_code",
        "code",
        "https://example.com/cb",
      );

      equal(apiCount, 1);
      equal(dataCount, 1);
      equal(managerCount, 1);
    });

    it("uses custom dataApiBaseURL for manageAudienceBlob client", async () => {
      const client = LineBotClient.create({
        channelAccessToken,
        dataApiBaseURL: "https://custom-data.example.com",
      });
      let requestCount = 0;

      server.use(
        http.post(
          "https://custom-data.example.com/v2/bot/audienceGroup/upload/byFile",
          ({ request }) => {
            requestCount++;
            const contentType = request.headers.get("content-type");
            ok(contentType);
            match(contentType!, /^multipart\/form-data; boundary=.*$/);
            return HttpResponse.json({ audienceGroupId: 55 });
          },
        ),
      );

      const res = await client.createAudienceForUploadingUserIds(
        new Blob(["user_id_1"], { type: "text/plain" }),
        "test audience",
        true,
      );
      equal(requestCount, 1);
      deepEqual(res, { audienceGroupId: 55 });
    });

    it("uses custom dataApiBaseURL for messagingApiBlob download client", async () => {
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

      const stream = await client.getMessageContent("msg456");
      equal(await readToString(stream), "data");
      equal(requestCount, 1);
    });

    it("uses custom dataApiBaseURL for messagingApiBlob upload client", async () => {
      const client = LineBotClient.create({
        channelAccessToken,
        dataApiBaseURL: "https://custom-data.example.com",
      });
      const image = new Blob(["png-binary"], { type: "image/png" });
      let requestCount = 0;

      server.use(
        http.post(
          "https://custom-data.example.com/v2/bot/richmenu/richmenu-456/content",
          async ({ request }) => {
            requestCount++;
            equal(request.headers.get("content-type"), "image/png");
            const body = await request.arrayBuffer();
            equal(body.byteLength, image.size);
            return HttpResponse.json({ uploaded: true });
          },
        ),
      );

      const res = await client.setRichMenuImage("richmenu-456", image);
      equal(requestCount, 1);
      deepEqual(res, { uploaded: true });
    });

    it("dataApiBaseURL does not affect api or manager clients", async () => {
      const client = LineBotClient.create({
        channelAccessToken,
        dataApiBaseURL: "https://custom-data.example.com",
      });
      let apiCount = 0;
      let dataCount = 0;
      let managerCount = 0;

      server.use(
        http.post("https://api.line.me/v2/bot/message/push", () => {
          apiCount++;
          return HttpResponse.json({});
        }),
        http.get(
          "https://custom-data.example.com/v2/bot/message/msg-data-isolation/content",
          () => {
            dataCount++;
            return HttpResponse.text("data");
          },
        ),
        http.post("https://manager.line.biz/module/auth/v1/token", () => {
          managerCount++;
          return HttpResponse.json({ access_token: "t" });
        }),
      );

      await client.pushMessage(createPushMessageRequest());
      equal(
        await readToString(
          await client.getMessageContent("msg-data-isolation"),
        ),
        "data",
      );
      await client.attachModule(
        "authorization_code",
        "code",
        "https://example.com/cb",
      );

      equal(apiCount, 1);
      equal(dataCount, 1);
      equal(managerCount, 1);
    });

    it("uses custom managerBaseURL for lineModuleAttach client", async () => {
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

      const res = await client.attachModule(
        "authorization_code",
        "code",
        "https://example.com/cb",
      );
      equal(requestCount, 1);
      deepEqual(res, { access_token: "t" });
    });

    it("managerBaseURL does not affect api or data clients", async () => {
      const client = LineBotClient.create({
        channelAccessToken,
        managerBaseURL: "https://custom-manager.example.com",
      });
      let apiCount = 0;
      let dataCount = 0;
      let managerCount = 0;

      server.use(
        http.post("https://api.line.me/v2/bot/message/push", () => {
          apiCount++;
          return HttpResponse.json({});
        }),
        http.get(
          "https://api-data.line.me/v2/bot/message/msg-manager-isolation/content",
          () => {
            dataCount++;
            return HttpResponse.text("data");
          },
        ),
        http.post(
          "https://custom-manager.example.com/module/auth/v1/token",
          () => {
            managerCount++;
            return HttpResponse.json({ access_token: "t" });
          },
        ),
      );

      await client.pushMessage(createPushMessageRequest());
      equal(
        await readToString(
          await client.getMessageContent("msg-manager-isolation"),
        ),
        "data",
      );
      await client.attachModule(
        "authorization_code",
        "code",
        "https://example.com/cb",
      );

      equal(apiCount, 1);
      equal(dataCount, 1);
      equal(managerCount, 1);
    });
  });

  describe("errors", () => {
    it("surfaces HTTPFetchError from api delegates", async () => {
      const client = LineBotClient.create({ channelAccessToken });

      server.use(
        http.post("https://api.line.me/v2/bot/message/push", () => {
          return HttpResponse.text("api boom", { status: 500 });
        }),
      );

      try {
        await client.pushMessage(createPushMessageRequest());
        ok(false, "expected pushMessage to throw");
      } catch (err) {
        ok(err instanceof HTTPFetchError);
        equal(err.status, 500);
        equal(err.body, "api boom");
      }
    });

    it("surfaces HTTPFetchError from data delegates", async () => {
      const client = LineBotClient.create({ channelAccessToken });

      server.use(
        http.get(
          "https://api-data.line.me/v2/bot/message/msg-error/content",
          () => {
            return HttpResponse.text("data boom", { status: 502 });
          },
        ),
      );

      try {
        await client.getMessageContent("msg-error");
        ok(false, "expected getMessageContent to throw");
      } catch (err) {
        ok(err instanceof HTTPFetchError);
        equal(err.status, 502);
        equal(err.body, "data boom");
      }
    });

    it("surfaces HTTPFetchError from manager delegates", async () => {
      const client = LineBotClient.create({ channelAccessToken });

      server.use(
        http.post("https://manager.line.biz/module/auth/v1/token", () => {
          return HttpResponse.text("manager boom", { status: 403 });
        }),
      );

      try {
        await client.attachModule(
          "authorization_code",
          "code",
          "https://example.com/cb",
        );
        ok(false, "expected attachModule to throw");
      } catch (err) {
        ok(err instanceof HTTPFetchError);
        equal(err.status, 403);
        equal(err.body, "manager boom");
      }
    });
  });
});
