import { shop } from "../lib";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal } from "assert";

const pkg = require("../package.json");

const channelAccessToken = "test_channel_access_token";

const client = new shop.ShopClient({
  channelAccessToken,
});

describe("shop", () => {
  it("missionStickerV3", async () => {
    const server = setupServer(
      http.post(
        "https://api.line.me/shop/v3/mission",
        ({ request, params, cookies }) => {
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          equal(
            request.headers.get("User-Agent"),
            `${pkg.name}/${pkg.version}`,
          );
          return HttpResponse.json({});
        },
      ),
    );

    server.listen();
    const res = await client.missionStickerV3({
      to: "U4af4980629",
      productId: "test_product_id",
      productType: "test_product_type",
      sendPresentMessage: false,
    });

    deepEqual(res, {});
    server.close();
  });
});
