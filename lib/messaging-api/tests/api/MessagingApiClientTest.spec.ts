import { MessagingApiClient } from "../../api";

import { AudienceMatchMessagesRequest } from "../../model/audienceMatchMessagesRequest";
import { BotInfoResponse } from "../../model/botInfoResponse";
import { BroadcastRequest } from "../../model/broadcastRequest";
import { CreateRichMenuAliasRequest } from "../../model/createRichMenuAliasRequest";
import { ErrorResponse } from "../../model/errorResponse";
import { GetAggregationUnitNameListResponse } from "../../model/getAggregationUnitNameListResponse";
import { GetAggregationUnitUsageResponse } from "../../model/getAggregationUnitUsageResponse";
import { GetFollowersResponse } from "../../model/getFollowersResponse";
import { GetWebhookEndpointResponse } from "../../model/getWebhookEndpointResponse";
import { GroupMemberCountResponse } from "../../model/groupMemberCountResponse";
import { GroupSummaryResponse } from "../../model/groupSummaryResponse";
import { GroupUserProfileResponse } from "../../model/groupUserProfileResponse";
import { IssueLinkTokenResponse } from "../../model/issueLinkTokenResponse";
import { MarkMessagesAsReadRequest } from "../../model/markMessagesAsReadRequest";
import { MembersIdsResponse } from "../../model/membersIdsResponse";
import { MessageQuotaResponse } from "../../model/messageQuotaResponse";
import { MulticastRequest } from "../../model/multicastRequest";
import { NarrowcastProgressResponse } from "../../model/narrowcastProgressResponse";
import { NarrowcastRequest } from "../../model/narrowcastRequest";
import { NumberOfMessagesResponse } from "../../model/numberOfMessagesResponse";
import { PnpMessagesRequest } from "../../model/pnpMessagesRequest";
import { PushMessageRequest } from "../../model/pushMessageRequest";
import { PushMessageResponse } from "../../model/pushMessageResponse";
import { QuotaConsumptionResponse } from "../../model/quotaConsumptionResponse";
import { ReplyMessageRequest } from "../../model/replyMessageRequest";
import { ReplyMessageResponse } from "../../model/replyMessageResponse";
import { RichMenuAliasListResponse } from "../../model/richMenuAliasListResponse";
import { RichMenuAliasResponse } from "../../model/richMenuAliasResponse";
import { RichMenuBatchProgressResponse } from "../../model/richMenuBatchProgressResponse";
import { RichMenuBatchRequest } from "../../model/richMenuBatchRequest";
import { RichMenuBulkLinkRequest } from "../../model/richMenuBulkLinkRequest";
import { RichMenuBulkUnlinkRequest } from "../../model/richMenuBulkUnlinkRequest";
import { RichMenuIdResponse } from "../../model/richMenuIdResponse";
import { RichMenuListResponse } from "../../model/richMenuListResponse";
import { RichMenuRequest } from "../../model/richMenuRequest";
import { RichMenuResponse } from "../../model/richMenuResponse";
import { RoomMemberCountResponse } from "../../model/roomMemberCountResponse";
import { RoomUserProfileResponse } from "../../model/roomUserProfileResponse";
import { SetWebhookEndpointRequest } from "../../model/setWebhookEndpointRequest";
import { TestWebhookEndpointRequest } from "../../model/testWebhookEndpointRequest";
import { TestWebhookEndpointResponse } from "../../model/testWebhookEndpointResponse";
import { UpdateRichMenuAliasRequest } from "../../model/updateRichMenuAliasRequest";
import { UserProfileResponse } from "../../model/userProfileResponse";
import { ValidateMessageRequest } from "../../model/validateMessageRequest";

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal } from "assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("MessagingApiClient", () => {
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

  const client = new MessagingApiClient({
    channelAccessToken: channel_access_token,
  });

  it("audienceMatch", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/bot/ad/multicast/phone";

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

    const res = await client.audienceMatch(
      // audienceMatchMessagesRequest: AudienceMatchMessagesRequest
      {} as unknown as AudienceMatchMessagesRequest, // paramName=audienceMatchMessagesRequest
    );

    equal(requestCount, 1);
  });

  it("broadcast", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/message/broadcast".replace(
      "{xLineRetryKey}",
      "DUMMY",
    ); // string

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

    const res = await client.broadcast(
      // broadcastRequest: BroadcastRequest
      {} as unknown as BroadcastRequest, // paramName=broadcastRequest
      // xLineRetryKey: string
      "DUMMY", // xLineRetryKey(string)
    );

    equal(requestCount, 1);
  });

  it("cancelDefaultRichMenu", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/user/all/richmenu";

    server.use(
      http.delete(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(
          request.headers.get("Authorization"),
          `Bearer ${channel_access_token}`,
        );
        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );

    const res = await client.cancelDefaultRichMenu();

    equal(requestCount, 1);
  });

  it("createRichMenu", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/richmenu";

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

    const res = await client.createRichMenu(
      // richMenuRequest: RichMenuRequest
      {} as unknown as RichMenuRequest, // paramName=richMenuRequest
    );

    equal(requestCount, 1);
  });

  it("createRichMenuAlias", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/richmenu/alias";

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

    const res = await client.createRichMenuAlias(
      // createRichMenuAliasRequest: CreateRichMenuAliasRequest
      {} as unknown as CreateRichMenuAliasRequest, // paramName=createRichMenuAliasRequest
    );

    equal(requestCount, 1);
  });

  it("deleteRichMenu", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/richmenu/{richMenuId}".replace(
      "{richMenuId}",
      "DUMMY",
    ); // string

    server.use(
      http.delete(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(
          request.headers.get("Authorization"),
          `Bearer ${channel_access_token}`,
        );
        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );

    const res = await client.deleteRichMenu(
      // richMenuId: string
      "DUMMY", // richMenuId(string)
    );

    equal(requestCount, 1);
  });

  it("deleteRichMenuAlias", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/richmenu/alias/{richMenuAliasId}".replace(
        "{richMenuAliasId}",
        "DUMMY",
      ); // string

    server.use(
      http.delete(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(
          request.headers.get("Authorization"),
          `Bearer ${channel_access_token}`,
        );
        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );

    const res = await client.deleteRichMenuAlias(
      // richMenuAliasId: string
      "DUMMY", // richMenuAliasId(string)
    );

    equal(requestCount, 1);
  });

  it("getAdPhoneMessageStatistics", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/message/delivery/ad_phone".replace(
        "{date}",
        "DUMMY",
      ); // string

    server.use(
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

    const res = await client.getAdPhoneMessageStatistics(
      // date: string
      "DUMMY" as unknown as string, // paramName=date(enum)
    );

    equal(requestCount, 1);
  });

  it("getAggregationUnitNameList", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/message/aggregation/list"
      .replace("{limit}", "DUMMY") // string
      .replace("{start}", "DUMMY"); // string

    server.use(
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

    const res = await client.getAggregationUnitNameList(
      // limit: string
      "DUMMY" as unknown as string, // paramName=limit(enum)
      // start: string
      "DUMMY" as unknown as string, // paramName=start(enum)
    );

    equal(requestCount, 1);
  });

  it("getAggregationUnitUsage", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/message/aggregation/info";

    server.use(
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

    const res = await client.getAggregationUnitUsage();

    equal(requestCount, 1);
  });

  it("getBotInfo", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/info";

    server.use(
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

    const res = await client.getBotInfo();

    equal(requestCount, 1);
  });

  it("getDefaultRichMenuId", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/user/all/richmenu";

    server.use(
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

    const res = await client.getDefaultRichMenuId();

    equal(requestCount, 1);
  });

  it("getFollowers", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/followers/ids"
      .replace("{start}", "DUMMY") // string
      .replace("{limit}", "0"); // number

    server.use(
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

    const res = await client.getFollowers(
      // start: string
      "DUMMY" as unknown as string, // paramName=start(enum)
      // limit: number
      "DUMMY" as unknown as number, // paramName=limit(enum)
    );

    equal(requestCount, 1);
  });

  it("getGroupMemberCount", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/group/{groupId}/members/count".replace(
        "{groupId}",
        "DUMMY",
      ); // string

    server.use(
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

    const res = await client.getGroupMemberCount(
      // groupId: string
      "DUMMY", // groupId(string)
    );

    equal(requestCount, 1);
  });

  it("getGroupMemberProfile", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/group/{groupId}/member/{userId}"
        .replace("{groupId}", "DUMMY") // string
        .replace("{userId}", "DUMMY"); // string

    server.use(
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

    const res = await client.getGroupMemberProfile(
      // groupId: string
      "DUMMY", // groupId(string)
      // userId: string
      "DUMMY", // userId(string)
    );

    equal(requestCount, 1);
  });

  it("getGroupMembersIds", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/group/{groupId}/members/ids"
      .replace("{groupId}", "DUMMY") // string
      .replace("{start}", "DUMMY"); // string

    server.use(
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

    const res = await client.getGroupMembersIds(
      // groupId: string
      "DUMMY", // groupId(string)
      // start: string
      "DUMMY" as unknown as string, // paramName=start(enum)
    );

    equal(requestCount, 1);
  });

  it("getGroupSummary", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/group/{groupId}/summary".replace(
        "{groupId}",
        "DUMMY",
      ); // string

    server.use(
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

    const res = await client.getGroupSummary(
      // groupId: string
      "DUMMY", // groupId(string)
    );

    equal(requestCount, 1);
  });

  it("getMessageQuota", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/message/quota";

    server.use(
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

    const res = await client.getMessageQuota();

    equal(requestCount, 1);
  });

  it("getMessageQuotaConsumption", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/message/quota/consumption";

    server.use(
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

    const res = await client.getMessageQuotaConsumption();

    equal(requestCount, 1);
  });

  it("getNarrowcastProgress", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/message/progress/narrowcast".replace(
        "{requestId}",
        "DUMMY",
      ); // string

    server.use(
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

    const res = await client.getNarrowcastProgress(
      // requestId: string
      "DUMMY" as unknown as string, // paramName=requestId(enum)
    );

    equal(requestCount, 1);
  });

  it("getNumberOfSentBroadcastMessages", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/message/delivery/broadcast".replace(
        "{date}",
        "DUMMY",
      ); // string

    server.use(
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

    const res = await client.getNumberOfSentBroadcastMessages(
      // date: string
      "DUMMY" as unknown as string, // paramName=date(enum)
    );

    equal(requestCount, 1);
  });

  it("getNumberOfSentMulticastMessages", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/message/delivery/multicast".replace(
        "{date}",
        "DUMMY",
      ); // string

    server.use(
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

    const res = await client.getNumberOfSentMulticastMessages(
      // date: string
      "DUMMY" as unknown as string, // paramName=date(enum)
    );

    equal(requestCount, 1);
  });

  it("getNumberOfSentPushMessages", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/message/delivery/push".replace(
      "{date}",
      "DUMMY",
    ); // string

    server.use(
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

    const res = await client.getNumberOfSentPushMessages(
      // date: string
      "DUMMY" as unknown as string, // paramName=date(enum)
    );

    equal(requestCount, 1);
  });

  it("getNumberOfSentReplyMessages", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/message/delivery/reply".replace(
        "{date}",
        "DUMMY",
      ); // string

    server.use(
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

    const res = await client.getNumberOfSentReplyMessages(
      // date: string
      "DUMMY" as unknown as string, // paramName=date(enum)
    );

    equal(requestCount, 1);
  });

  it("getPNPMessageStatistics", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/message/delivery/pnp".replace(
      "{date}",
      "DUMMY",
    ); // string

    server.use(
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

    const res = await client.getPNPMessageStatistics(
      // date: string
      "DUMMY" as unknown as string, // paramName=date(enum)
    );

    equal(requestCount, 1);
  });

  it("getProfile", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/profile/{userId}".replace(
      "{userId}",
      "DUMMY",
    ); // string

    server.use(
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

    const res = await client.getProfile(
      // userId: string
      "DUMMY", // userId(string)
    );

    equal(requestCount, 1);
  });

  it("getRichMenu", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/richmenu/{richMenuId}".replace(
      "{richMenuId}",
      "DUMMY",
    ); // string

    server.use(
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

    const res = await client.getRichMenu(
      // richMenuId: string
      "DUMMY", // richMenuId(string)
    );

    equal(requestCount, 1);
  });

  it("getRichMenuAlias", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/richmenu/alias/{richMenuAliasId}".replace(
        "{richMenuAliasId}",
        "DUMMY",
      ); // string

    server.use(
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

    const res = await client.getRichMenuAlias(
      // richMenuAliasId: string
      "DUMMY", // richMenuAliasId(string)
    );

    equal(requestCount, 1);
  });

  it("getRichMenuAliasList", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/richmenu/alias/list";

    server.use(
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

    const res = await client.getRichMenuAliasList();

    equal(requestCount, 1);
  });

  it("getRichMenuBatchProgress", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/richmenu/progress/batch".replace(
        "{requestId}",
        "DUMMY",
      ); // string

    server.use(
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

    const res = await client.getRichMenuBatchProgress(
      // requestId: string
      "DUMMY" as unknown as string, // paramName=requestId(enum)
    );

    equal(requestCount, 1);
  });

  it("getRichMenuIdOfUser", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/user/{userId}/richmenu".replace(
        "{userId}",
        "DUMMY",
      ); // string

    server.use(
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

    const res = await client.getRichMenuIdOfUser(
      // userId: string
      "DUMMY", // userId(string)
    );

    equal(requestCount, 1);
  });

  it("getRichMenuList", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/richmenu/list";

    server.use(
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

    const res = await client.getRichMenuList();

    equal(requestCount, 1);
  });

  it("getRoomMemberCount", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/room/{roomId}/members/count".replace(
        "{roomId}",
        "DUMMY",
      ); // string

    server.use(
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

    const res = await client.getRoomMemberCount(
      // roomId: string
      "DUMMY", // roomId(string)
    );

    equal(requestCount, 1);
  });

  it("getRoomMemberProfile", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/room/{roomId}/member/{userId}"
      .replace("{roomId}", "DUMMY") // string
      .replace("{userId}", "DUMMY"); // string

    server.use(
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

    const res = await client.getRoomMemberProfile(
      // roomId: string
      "DUMMY", // roomId(string)
      // userId: string
      "DUMMY", // userId(string)
    );

    equal(requestCount, 1);
  });

  it("getRoomMembersIds", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/room/{roomId}/members/ids"
      .replace("{roomId}", "DUMMY") // string
      .replace("{start}", "DUMMY"); // string

    server.use(
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

    const res = await client.getRoomMembersIds(
      // roomId: string
      "DUMMY", // roomId(string)
      // start: string
      "DUMMY" as unknown as string, // paramName=start(enum)
    );

    equal(requestCount, 1);
  });

  it("getWebhookEndpoint", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/channel/webhook/endpoint";

    server.use(
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

    const res = await client.getWebhookEndpoint();

    equal(requestCount, 1);
  });

  it("issueLinkToken", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/user/{userId}/linkToken".replace(
        "{userId}",
        "DUMMY",
      ); // string

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

    const res = await client.issueLinkToken(
      // userId: string
      "DUMMY", // userId(string)
    );

    equal(requestCount, 1);
  });

  it("leaveGroup", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/group/{groupId}/leave".replace(
      "{groupId}",
      "DUMMY",
    ); // string

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

    const res = await client.leaveGroup(
      // groupId: string
      "DUMMY", // groupId(string)
    );

    equal(requestCount, 1);
  });

  it("leaveRoom", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/room/{roomId}/leave".replace(
      "{roomId}",
      "DUMMY",
    ); // string

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

    const res = await client.leaveRoom(
      // roomId: string
      "DUMMY", // roomId(string)
    );

    equal(requestCount, 1);
  });

  it("linkRichMenuIdToUser", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/user/{userId}/richmenu/{richMenuId}"
        .replace("{userId}", "DUMMY") // string
        .replace("{richMenuId}", "DUMMY"); // string

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

    const res = await client.linkRichMenuIdToUser(
      // userId: string
      "DUMMY", // userId(string)
      // richMenuId: string
      "DUMMY", // richMenuId(string)
    );

    equal(requestCount, 1);
  });

  it("linkRichMenuIdToUsers", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/richmenu/bulk/link";

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

    const res = await client.linkRichMenuIdToUsers(
      // richMenuBulkLinkRequest: RichMenuBulkLinkRequest
      {} as unknown as RichMenuBulkLinkRequest, // paramName=richMenuBulkLinkRequest
    );

    equal(requestCount, 1);
  });

  it("markMessagesAsRead", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/message/markAsRead";

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

    const res = await client.markMessagesAsRead(
      // markMessagesAsReadRequest: MarkMessagesAsReadRequest
      {} as unknown as MarkMessagesAsReadRequest, // paramName=markMessagesAsReadRequest
    );

    equal(requestCount, 1);
  });

  it("multicast", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/message/multicast".replace(
      "{xLineRetryKey}",
      "DUMMY",
    ); // string

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

    const res = await client.multicast(
      // multicastRequest: MulticastRequest
      {} as unknown as MulticastRequest, // paramName=multicastRequest
      // xLineRetryKey: string
      "DUMMY", // xLineRetryKey(string)
    );

    equal(requestCount, 1);
  });

  it("narrowcast", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/message/narrowcast".replace(
      "{xLineRetryKey}",
      "DUMMY",
    ); // string

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

    const res = await client.narrowcast(
      // narrowcastRequest: NarrowcastRequest
      {} as unknown as NarrowcastRequest, // paramName=narrowcastRequest
      // xLineRetryKey: string
      "DUMMY", // xLineRetryKey(string)
    );

    equal(requestCount, 1);
  });

  it("pushMessage", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/message/push".replace(
      "{xLineRetryKey}",
      "DUMMY",
    ); // string

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

    const res = await client.pushMessage(
      // pushMessageRequest: PushMessageRequest
      {} as unknown as PushMessageRequest, // paramName=pushMessageRequest
      // xLineRetryKey: string
      "DUMMY", // xLineRetryKey(string)
    );

    equal(requestCount, 1);
  });

  it("pushMessagesByPhone", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/bot/pnp/push".replace(
      "{xLineDeliveryTag}",
      "DUMMY",
    ); // string

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

    const res = await client.pushMessagesByPhone(
      // pnpMessagesRequest: PnpMessagesRequest
      {} as unknown as PnpMessagesRequest, // paramName=pnpMessagesRequest
      // xLineDeliveryTag: string
      "DUMMY", // xLineDeliveryTag(string)
    );

    equal(requestCount, 1);
  });

  it("replyMessage", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/message/reply";

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

    const res = await client.replyMessage(
      // replyMessageRequest: ReplyMessageRequest
      {} as unknown as ReplyMessageRequest, // paramName=replyMessageRequest
    );

    equal(requestCount, 1);
  });

  it("richMenuBatch", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/richmenu/batch";

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

    const res = await client.richMenuBatch(
      // richMenuBatchRequest: RichMenuBatchRequest
      {} as unknown as RichMenuBatchRequest, // paramName=richMenuBatchRequest
    );

    equal(requestCount, 1);
  });

  it("setDefaultRichMenu", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/user/all/richmenu/{richMenuId}".replace(
        "{richMenuId}",
        "DUMMY",
      ); // string

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

    const res = await client.setDefaultRichMenu(
      // richMenuId: string
      "DUMMY", // richMenuId(string)
    );

    equal(requestCount, 1);
  });

  it("setWebhookEndpoint", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/channel/webhook/endpoint";

    server.use(
      http.put(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(
          request.headers.get("Authorization"),
          `Bearer ${channel_access_token}`,
        );
        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );

    const res = await client.setWebhookEndpoint(
      // setWebhookEndpointRequest: SetWebhookEndpointRequest
      {} as unknown as SetWebhookEndpointRequest, // paramName=setWebhookEndpointRequest
    );

    equal(requestCount, 1);
  });

  it("testWebhookEndpoint", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/channel/webhook/test";

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

    const res = await client.testWebhookEndpoint(
      // testWebhookEndpointRequest: TestWebhookEndpointRequest
      {} as unknown as TestWebhookEndpointRequest, // paramName=testWebhookEndpointRequest
    );

    equal(requestCount, 1);
  });

  it("unlinkRichMenuIdFromUser", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/user/{userId}/richmenu".replace(
        "{userId}",
        "DUMMY",
      ); // string

    server.use(
      http.delete(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(
          request.headers.get("Authorization"),
          `Bearer ${channel_access_token}`,
        );
        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );

    const res = await client.unlinkRichMenuIdFromUser(
      // userId: string
      "DUMMY", // userId(string)
    );

    equal(requestCount, 1);
  });

  it("unlinkRichMenuIdFromUsers", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/richmenu/bulk/unlink";

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

    const res = await client.unlinkRichMenuIdFromUsers(
      // richMenuBulkUnlinkRequest: RichMenuBulkUnlinkRequest
      {} as unknown as RichMenuBulkUnlinkRequest, // paramName=richMenuBulkUnlinkRequest
    );

    equal(requestCount, 1);
  });

  it("updateRichMenuAlias", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/richmenu/alias/{richMenuAliasId}".replace(
        "{richMenuAliasId}",
        "DUMMY",
      ); // string

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

    const res = await client.updateRichMenuAlias(
      // richMenuAliasId: string
      "DUMMY", // richMenuAliasId(string)
      // updateRichMenuAliasRequest: UpdateRichMenuAliasRequest
      {} as unknown as UpdateRichMenuAliasRequest, // paramName=updateRichMenuAliasRequest
    );

    equal(requestCount, 1);
  });

  it("validateBroadcast", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/message/validate/broadcast";

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

    const res = await client.validateBroadcast(
      // validateMessageRequest: ValidateMessageRequest
      {} as unknown as ValidateMessageRequest, // paramName=validateMessageRequest
    );

    equal(requestCount, 1);
  });

  it("validateMulticast", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/message/validate/multicast";

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

    const res = await client.validateMulticast(
      // validateMessageRequest: ValidateMessageRequest
      {} as unknown as ValidateMessageRequest, // paramName=validateMessageRequest
    );

    equal(requestCount, 1);
  });

  it("validateNarrowcast", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/message/validate/narrowcast";

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

    const res = await client.validateNarrowcast(
      // validateMessageRequest: ValidateMessageRequest
      {} as unknown as ValidateMessageRequest, // paramName=validateMessageRequest
    );

    equal(requestCount, 1);
  });

  it("validatePush", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/message/validate/push";

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

    const res = await client.validatePush(
      // validateMessageRequest: ValidateMessageRequest
      {} as unknown as ValidateMessageRequest, // paramName=validateMessageRequest
    );

    equal(requestCount, 1);
  });

  it("validateReply", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/message/validate/reply";

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

    const res = await client.validateReply(
      // validateMessageRequest: ValidateMessageRequest
      {} as unknown as ValidateMessageRequest, // paramName=validateMessageRequest
    );

    equal(requestCount, 1);
  });

  it("validateRichMenuBatchRequest", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/richmenu/validate/batch";

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

    const res = await client.validateRichMenuBatchRequest(
      // richMenuBatchRequest: RichMenuBatchRequest
      {} as unknown as RichMenuBatchRequest, // paramName=richMenuBatchRequest
    );

    equal(requestCount, 1);
  });

  it("validateRichMenuObject", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/richmenu/validate";

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

    const res = await client.validateRichMenuObject(
      // richMenuRequest: RichMenuRequest
      {} as unknown as RichMenuRequest, // paramName=richMenuRequest
    );

    equal(requestCount, 1);
  });
});
