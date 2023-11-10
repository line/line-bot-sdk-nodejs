import { shop } from "../lib";
import { createServer } from "http";
import { deepEqual, equal } from "assert";
import { TestServer } from "./helpers/server";

const pkg = require("../package.json");

const channelAccessToken = "test_channel_access_token";

describe("shop", () => {
  const server = new TestServer();
  beforeEach(async () => {
    server.reset();
    await server.listen();
  });
  afterEach(async () => {
    await server.close();
  });

  it("missionStickerV3", async () => {
    server.setHandler((req, res) => {
      equal(req.url, "/shop/v3/mission");

      equal(req.headers.authorization, "Bearer test_channel_access_token");
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);

      res.writeHead(200, { "Content-type": "application/json" });
      res.end(JSON.stringify({}));
    });

    const client = new shop.ShopClient({
      channelAccessToken,
      baseURL: server.getUrl(),
    });

    const res = await client.missionStickerV3({
      to: "U4af4980629",
      productId: "test_product_id",
      productType: "test_product_type",
      sendPresentMessage: false,
    });

    deepEqual(res, {});
    equal(server.getRequestCount(), 1);
  });
});
