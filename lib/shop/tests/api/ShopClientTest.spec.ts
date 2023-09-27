import { ShopClient } from "../../api";

import { MissionStickerRequest } from "../../model/missionStickerRequest";

import * as nock from "nock";
import { deepEqual, equal } from "assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("ShopClient", () => {
  before(() => nock.disableNetConnect());
  afterEach(() => nock.cleanAll());
  after(() => nock.enableNetConnect());

  const client = new ShopClient({
    channelAccessToken: channel_access_token,
  });

  it("missionStickerV3", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u => u.includes("/shop/v3/mission"))
      .reply(200, {});

    const res = await client.missionStickerV3(
      // missionStickerRequest: MissionStickerRequest
      {} as unknown as MissionStickerRequest, // paramName=missionStickerRequest
    );
    equal(scope.isDone(), true);
  });
});
