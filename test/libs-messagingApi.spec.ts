import { messagingApi } from "../lib";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal } from "assert";

const pkg = require("../package.json");

const channelAccessToken = "test_channel_access_token";

const client = new messagingApi.MessagingApiClient({
  channelAccessToken,
});

const blobClient = new messagingApi.MessagingApiBlobClient({
  channelAccessToken,
});

describe("messagingApi", () => {
  const server = setupServer();
  before(() => {
    server.listen();
  });
  after(() => {
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
          equal(
            request.headers.get("User-Agent"),
            `${pkg.name}/${pkg.version}`,
          );
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
          equal(
            request.headers.get("User-Agent"),
            `${pkg.name}/${pkg.version}`,
          );
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
});
