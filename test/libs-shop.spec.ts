import { shop } from "../lib";
import { createServer } from "http";
import { deepEqual, equal } from "assert";

const pkg = require("../package.json");

const channelAccessToken = "test_channel_access_token";

describe("shop", () => {
  it("missionStickerV3", async () => {
    let requestCount = 0;
    const server = createServer((req, res) => {
      requestCount++;

      equal(req.url, "/shop/v3/mission");

      equal(req.headers.authorization, "Bearer test_channel_access_token");
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);

      res.writeHead(200, { "Content-type": "application/json" });
      res.end(JSON.stringify({}));
    });
    await new Promise(resolve => {
      server.listen(0);
      server.on("listening", resolve);
    });

    const serverAddress = server.address();
    if (typeof serverAddress === "string" || serverAddress === null) {
      throw new Error("Unexpected server address: " + serverAddress);
    }

    const client = new shop.ShopClient({
      channelAccessToken,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });


    const res = await client.missionStickerV3({
      to: "U4af4980629",
      productId: "test_product_id",
      productType: "test_product_type",
      sendPresentMessage: false,
    });

    deepEqual(res, {});
    equal(requestCount, 1);
    server.close();
  });
});
