import { InsightClient } from "../../api";

import { GetFriendsDemographicsResponse } from "../../model/getFriendsDemographicsResponse";
import { GetMessageEventResponse } from "../../model/getMessageEventResponse";
import { GetNumberOfFollowersResponse } from "../../model/getNumberOfFollowersResponse";
import { GetNumberOfMessageDeliveriesResponse } from "../../model/getNumberOfMessageDeliveriesResponse";
import { GetStatisticsPerUnitResponse } from "../../model/getStatisticsPerUnitResponse";

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal } from "assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("InsightClient", () => {
  const client = new InsightClient({
    channelAccessToken: channel_access_token,
  });

  it("getFriendsDemographics", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/insight/demographic";

    const server = setupServer(
      http.get(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(
          request.headers.get("Authorization"),
          `Bearer ${channel_access_token}`,
        );
        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );
    server.listen();

    const res = await client.getFriendsDemographics();

    equal(requestCount, 1);

    server.close();
  });

  it("getMessageEvent", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/insight/message/event".replace(
      "{requestId}",
      "DUMMY",
    ); // string

    const server = setupServer(
      http.get(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(
          request.headers.get("Authorization"),
          `Bearer ${channel_access_token}`,
        );
        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );
    server.listen();

    const res = await client.getMessageEvent(
      // requestId: string
      "DUMMY" as unknown as string, // paramName=requestId(enum)
    );

    equal(requestCount, 1);

    server.close();
  });

  it("getNumberOfFollowers", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/insight/followers".replace(
      "{date}",
      "DUMMY",
    ); // string

    const server = setupServer(
      http.get(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(
          request.headers.get("Authorization"),
          `Bearer ${channel_access_token}`,
        );
        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );
    server.listen();

    const res = await client.getNumberOfFollowers(
      // date: string
      "DUMMY" as unknown as string, // paramName=date(enum)
    );

    equal(requestCount, 1);

    server.close();
  });

  it("getNumberOfMessageDeliveries", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/insight/message/delivery".replace(
        "{date}",
        "DUMMY",
      ); // string

    const server = setupServer(
      http.get(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(
          request.headers.get("Authorization"),
          `Bearer ${channel_access_token}`,
        );
        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );
    server.listen();

    const res = await client.getNumberOfMessageDeliveries(
      // date: string
      "DUMMY" as unknown as string, // paramName=date(enum)
    );

    equal(requestCount, 1);

    server.close();
  });

  it("getStatisticsPerUnit", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/insight/message/event/aggregation"
        .replace("{customAggregationUnit}", "DUMMY") // string
        .replace("{from}", "DUMMY") // string
        .replace("{to}", "DUMMY"); // string

    const server = setupServer(
      http.get(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(
          request.headers.get("Authorization"),
          `Bearer ${channel_access_token}`,
        );
        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );
    server.listen();

    const res = await client.getStatisticsPerUnit(
      // customAggregationUnit: string
      "DUMMY" as unknown as string, // paramName=customAggregationUnit(enum)
      // from: string
      "DUMMY" as unknown as string, // paramName=from(enum)
      // to: string
      "DUMMY" as unknown as string, // paramName=to(enum)
    );

    equal(requestCount, 1);

    server.close();
  });
});
