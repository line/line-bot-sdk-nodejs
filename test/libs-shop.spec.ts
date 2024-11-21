import { shop } from "../lib/index.js";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal } from "node:assert";

import { describe, it, beforeAll, afterAll, afterEach } from "vitest";

const channelAccessToken = "test_channel_access_token";

const client = new shop.ShopClient({
  channelAccessToken,
});

describe("shop", () => {
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

  it("missionStickerV3", async () => {
    server.use(
      http.post(
        "https://api.line.me/shop/v3/mission",
        ({ request, params, cookies }) => {
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          equal(request.headers.get("User-Agent"), "@line/bot-sdk/1.0.0-test");
          return HttpResponse.json({});
        },
      ),
    );

    const res = await client.missionStickerV3({
      to: "U4af4980629",
      productId: "test_product_id",
      productType: "test_product_type",
      sendPresentMessage: false,
    });

    deepEqual(res, {});
  });
});
