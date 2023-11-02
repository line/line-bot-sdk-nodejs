import { ShopClient } from "../../api";

import { MissionStickerRequest } from "../../model/missionStickerRequest";

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal } from "assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("ShopClient", () => {
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

  const client = new ShopClient({
    channelAccessToken: channel_access_token,
  });

  it("missionStickerV3", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/shop/v3/mission";

    server.use(
      http.post(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(
          request.headers.get("Authorization"),
          `Bearer ${channel_access_token}`,
        );
        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );

    const res = await client.missionStickerV3(
      // missionStickerRequest: MissionStickerRequest
      {} as unknown as MissionStickerRequest, // paramName=missionStickerRequest
    );

    equal(requestCount, 1);
  });
});
