import { shop } from "../lib";
import * as nock from "nock";
import { deepEqual, equal } from "assert";

const pkg = require("../package.json");

const channelAccessToken = "test_channel_access_token";

const client = new shop.ShopClient({
  channelAccessToken,
});

describe("shop", () => {
  before(() => nock.disableNetConnect());
  afterEach(() => nock.cleanAll());
  after(() => nock.enableNetConnect());

  it("missionStickerV3", async () => {
    const scope = nock("https://api.line.me/", {
      reqheaders: {
        Authorization: "Bearer test_channel_access_token",
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post("/shop/v3/mission", {
        to: "U4af4980629",
        productId: "test_product_id",
        productType: "test_product_type",
        sendPresentMessage: false,
      })
      .reply(200, {});

    const res = await client.missionStickerV3({
      to: "U4af4980629",
      productId: "test_product_id",
      productType: "test_product_type",
      sendPresentMessage: false,
    });
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });
});
