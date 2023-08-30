import { InsightClient } from "../../api";

import { GetFriendsDemographicsResponse } from "../../model/getFriendsDemographicsResponse";
import { GetMessageEventResponse } from "../../model/getMessageEventResponse";
import { GetNumberOfFollowersResponse } from "../../model/getNumberOfFollowersResponse";
import { GetNumberOfMessageDeliveriesResponse } from "../../model/getNumberOfMessageDeliveriesResponse";
import { GetStatisticsPerUnitResponse } from "../../model/getStatisticsPerUnitResponse";

import * as nock from "nock";
import { deepEqual, equal } from "assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("InsightClient", () => {
  before(() => nock.disableNetConnect());
  afterEach(() => nock.cleanAll());
  after(() => nock.enableNetConnect());

  const client = new InsightClient({
    channelAccessToken: channel_access_token,
  });

  it("getFriendsDemographics", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u => u.includes("/v2/bot/insight/demographic"))
      .reply(200, {});

    const res = await client.getFriendsDemographics();
    equal(scope.isDone(), true);
  });

  it("getMessageEvent", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/insight/message/event".replace("{requestId}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.getMessageEvent(
      // requestId: string
      "DUMMY" as unknown as string, // paramName=requestId(enum)
    );
    equal(scope.isDone(), true);
  });

  it("getNumberOfFollowers", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/insight/followers".replace("{date}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.getNumberOfFollowers(
      // date: string
      "DUMMY" as unknown as string, // paramName=date(enum)
    );
    equal(scope.isDone(), true);
  });

  it("getNumberOfMessageDeliveries", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/insight/message/delivery".replace("{date}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.getNumberOfMessageDeliveries(
      // date: string
      "DUMMY" as unknown as string, // paramName=date(enum)
    );
    equal(scope.isDone(), true);
  });

  it("getStatisticsPerUnit", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/insight/message/event/aggregation"
            .replace("{customAggregationUnit}", "DUMMY") // string

            .replace("{from}", "DUMMY") // string

            .replace("{to}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.getStatisticsPerUnit(
      // customAggregationUnit: string
      "DUMMY" as unknown as string, // paramName=customAggregationUnit(enum)
      // from: string
      "DUMMY" as unknown as string, // paramName=from(enum)
      // to: string
      "DUMMY" as unknown as string, // paramName=to(enum)
    );
    equal(scope.isDone(), true);
  });
});
