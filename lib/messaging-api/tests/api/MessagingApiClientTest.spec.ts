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

import * as nock from "nock";
import { deepEqual, equal } from "assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("MessagingApiClient", () => {
  before(() => nock.disableNetConnect());
  afterEach(() => nock.cleanAll());
  after(() => nock.enableNetConnect());

  const client = new MessagingApiClient({
    channelAccessToken: channel_access_token,
  });

  it("audienceMatch", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u => u.includes("/bot/ad/multicast/phone"))
      .reply(200, {});

    const res = await client.audienceMatch(
      // audienceMatchMessagesRequest: AudienceMatchMessagesRequest
      {} as unknown as AudienceMatchMessagesRequest, // paramName=audienceMatchMessagesRequest
    );
    equal(scope.isDone(), true);
  });

  it("broadcast", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u =>
        u.includes(
          "/v2/bot/message/broadcast".replace("{xLineRetryKey}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.broadcast(
      // broadcastRequest: BroadcastRequest
      {} as unknown as BroadcastRequest, // paramName=broadcastRequest
      // xLineRetryKey: string
      "DUMMY", // xLineRetryKey(string)
    );
    equal(scope.isDone(), true);
  });

  it("cancelDefaultRichMenu", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .delete(u => u.includes("/v2/bot/user/all/richmenu"))
      .reply(200, {});

    const res = await client.cancelDefaultRichMenu();
    equal(scope.isDone(), true);
  });

  it("createRichMenu", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u => u.includes("/v2/bot/richmenu"))
      .reply(200, {});

    const res = await client.createRichMenu(
      // richMenuRequest: RichMenuRequest
      {} as unknown as RichMenuRequest, // paramName=richMenuRequest
    );
    equal(scope.isDone(), true);
  });

  it("createRichMenuAlias", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u => u.includes("/v2/bot/richmenu/alias"))
      .reply(200, {});

    const res = await client.createRichMenuAlias(
      // createRichMenuAliasRequest: CreateRichMenuAliasRequest
      {} as unknown as CreateRichMenuAliasRequest, // paramName=createRichMenuAliasRequest
    );
    equal(scope.isDone(), true);
  });

  it("deleteRichMenu", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .delete(u =>
        u.includes(
          "/v2/bot/richmenu/{richMenuId}".replace("{richMenuId}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.deleteRichMenu(
      // richMenuId: string
      "DUMMY", // richMenuId(string)
    );
    equal(scope.isDone(), true);
  });

  it("deleteRichMenuAlias", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .delete(u =>
        u.includes(
          "/v2/bot/richmenu/alias/{richMenuAliasId}".replace(
            "{richMenuAliasId}",
            "DUMMY",
          ), // string
        ),
      )
      .reply(200, {});

    const res = await client.deleteRichMenuAlias(
      // richMenuAliasId: string
      "DUMMY", // richMenuAliasId(string)
    );
    equal(scope.isDone(), true);
  });

  it("getAdPhoneMessageStatistics", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/message/delivery/ad_phone".replace("{date}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.getAdPhoneMessageStatistics(
      // date: string
      "DUMMY" as unknown as string, // paramName=date(enum)
    );
    equal(scope.isDone(), true);
  });

  it("getAggregationUnitNameList", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/message/aggregation/list"
            .replace("{limit}", "DUMMY") // string

            .replace("{start}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.getAggregationUnitNameList(
      // limit: string
      "DUMMY" as unknown as string, // paramName=limit(enum)
      // start: string
      "DUMMY" as unknown as string, // paramName=start(enum)
    );
    equal(scope.isDone(), true);
  });

  it("getAggregationUnitUsage", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u => u.includes("/v2/bot/message/aggregation/info"))
      .reply(200, {});

    const res = await client.getAggregationUnitUsage();
    equal(scope.isDone(), true);
  });

  it("getBotInfo", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u => u.includes("/v2/bot/info"))
      .reply(200, {});

    const res = await client.getBotInfo();
    equal(scope.isDone(), true);
  });

  it("getDefaultRichMenuId", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u => u.includes("/v2/bot/user/all/richmenu"))
      .reply(200, {});

    const res = await client.getDefaultRichMenuId();
    equal(scope.isDone(), true);
  });

  it("getFollowers", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/followers/ids"
            .replace("{start}", "DUMMY") // string

            .replace("{limit}", "0"), // number
        ),
      )
      .reply(200, {});

    const res = await client.getFollowers(
      // start: string
      "DUMMY" as unknown as string, // paramName=start(enum)
      // limit: number
      "DUMMY" as unknown as number, // paramName=limit(enum)
    );
    equal(scope.isDone(), true);
  });

  it("getGroupMemberCount", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/group/{groupId}/members/count".replace("{groupId}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.getGroupMemberCount(
      // groupId: string
      "DUMMY", // groupId(string)
    );
    equal(scope.isDone(), true);
  });

  it("getGroupMemberProfile", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/group/{groupId}/member/{userId}"
            .replace("{groupId}", "DUMMY") // string

            .replace("{userId}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.getGroupMemberProfile(
      // groupId: string
      "DUMMY", // groupId(string)
      // userId: string
      "DUMMY", // userId(string)
    );
    equal(scope.isDone(), true);
  });

  it("getGroupMembersIds", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/group/{groupId}/members/ids"
            .replace("{groupId}", "DUMMY") // string

            .replace("{start}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.getGroupMembersIds(
      // groupId: string
      "DUMMY", // groupId(string)
      // start: string
      "DUMMY" as unknown as string, // paramName=start(enum)
    );
    equal(scope.isDone(), true);
  });

  it("getGroupSummary", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/group/{groupId}/summary".replace("{groupId}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.getGroupSummary(
      // groupId: string
      "DUMMY", // groupId(string)
    );
    equal(scope.isDone(), true);
  });

  it("getMessageQuota", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u => u.includes("/v2/bot/message/quota"))
      .reply(200, {});

    const res = await client.getMessageQuota();
    equal(scope.isDone(), true);
  });

  it("getMessageQuotaConsumption", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u => u.includes("/v2/bot/message/quota/consumption"))
      .reply(200, {});

    const res = await client.getMessageQuotaConsumption();
    equal(scope.isDone(), true);
  });

  it("getNarrowcastProgress", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/message/progress/narrowcast".replace("{requestId}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.getNarrowcastProgress(
      // requestId: string
      "DUMMY" as unknown as string, // paramName=requestId(enum)
    );
    equal(scope.isDone(), true);
  });

  it("getNumberOfSentBroadcastMessages", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/message/delivery/broadcast".replace("{date}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.getNumberOfSentBroadcastMessages(
      // date: string
      "DUMMY" as unknown as string, // paramName=date(enum)
    );
    equal(scope.isDone(), true);
  });

  it("getNumberOfSentMulticastMessages", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/message/delivery/multicast".replace("{date}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.getNumberOfSentMulticastMessages(
      // date: string
      "DUMMY" as unknown as string, // paramName=date(enum)
    );
    equal(scope.isDone(), true);
  });

  it("getNumberOfSentPushMessages", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/message/delivery/push".replace("{date}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.getNumberOfSentPushMessages(
      // date: string
      "DUMMY" as unknown as string, // paramName=date(enum)
    );
    equal(scope.isDone(), true);
  });

  it("getNumberOfSentReplyMessages", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/message/delivery/reply".replace("{date}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.getNumberOfSentReplyMessages(
      // date: string
      "DUMMY" as unknown as string, // paramName=date(enum)
    );
    equal(scope.isDone(), true);
  });

  it("getPNPMessageStatistics", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/message/delivery/pnp".replace("{date}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.getPNPMessageStatistics(
      // date: string
      "DUMMY" as unknown as string, // paramName=date(enum)
    );
    equal(scope.isDone(), true);
  });

  it("getProfile", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/profile/{userId}".replace("{userId}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.getProfile(
      // userId: string
      "DUMMY", // userId(string)
    );
    equal(scope.isDone(), true);
  });

  it("getRichMenu", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/richmenu/{richMenuId}".replace("{richMenuId}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.getRichMenu(
      // richMenuId: string
      "DUMMY", // richMenuId(string)
    );
    equal(scope.isDone(), true);
  });

  it("getRichMenuAlias", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/richmenu/alias/{richMenuAliasId}".replace(
            "{richMenuAliasId}",
            "DUMMY",
          ), // string
        ),
      )
      .reply(200, {});

    const res = await client.getRichMenuAlias(
      // richMenuAliasId: string
      "DUMMY", // richMenuAliasId(string)
    );
    equal(scope.isDone(), true);
  });

  it("getRichMenuAliasList", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u => u.includes("/v2/bot/richmenu/alias/list"))
      .reply(200, {});

    const res = await client.getRichMenuAliasList();
    equal(scope.isDone(), true);
  });

  it("getRichMenuBatchProgress", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/richmenu/progress/batch".replace("{requestId}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.getRichMenuBatchProgress(
      // requestId: string
      "DUMMY" as unknown as string, // paramName=requestId(enum)
    );
    equal(scope.isDone(), true);
  });

  it("getRichMenuIdOfUser", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/user/{userId}/richmenu".replace("{userId}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.getRichMenuIdOfUser(
      // userId: string
      "DUMMY", // userId(string)
    );
    equal(scope.isDone(), true);
  });

  it("getRichMenuList", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u => u.includes("/v2/bot/richmenu/list"))
      .reply(200, {});

    const res = await client.getRichMenuList();
    equal(scope.isDone(), true);
  });

  it("getRoomMemberCount", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/room/{roomId}/members/count".replace("{roomId}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.getRoomMemberCount(
      // roomId: string
      "DUMMY", // roomId(string)
    );
    equal(scope.isDone(), true);
  });

  it("getRoomMemberProfile", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/room/{roomId}/member/{userId}"
            .replace("{roomId}", "DUMMY") // string

            .replace("{userId}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.getRoomMemberProfile(
      // roomId: string
      "DUMMY", // roomId(string)
      // userId: string
      "DUMMY", // userId(string)
    );
    equal(scope.isDone(), true);
  });

  it("getRoomMembersIds", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/room/{roomId}/members/ids"
            .replace("{roomId}", "DUMMY") // string

            .replace("{start}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.getRoomMembersIds(
      // roomId: string
      "DUMMY", // roomId(string)
      // start: string
      "DUMMY" as unknown as string, // paramName=start(enum)
    );
    equal(scope.isDone(), true);
  });

  it("getWebhookEndpoint", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u => u.includes("/v2/bot/channel/webhook/endpoint"))
      .reply(200, {});

    const res = await client.getWebhookEndpoint();
    equal(scope.isDone(), true);
  });

  it("issueLinkToken", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u =>
        u.includes(
          "/v2/bot/user/{userId}/linkToken".replace("{userId}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.issueLinkToken(
      // userId: string
      "DUMMY", // userId(string)
    );
    equal(scope.isDone(), true);
  });

  it("leaveGroup", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u =>
        u.includes(
          "/v2/bot/group/{groupId}/leave".replace("{groupId}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.leaveGroup(
      // groupId: string
      "DUMMY", // groupId(string)
    );
    equal(scope.isDone(), true);
  });

  it("leaveRoom", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u =>
        u.includes(
          "/v2/bot/room/{roomId}/leave".replace("{roomId}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.leaveRoom(
      // roomId: string
      "DUMMY", // roomId(string)
    );
    equal(scope.isDone(), true);
  });

  it("linkRichMenuIdToUser", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u =>
        u.includes(
          "/v2/bot/user/{userId}/richmenu/{richMenuId}"
            .replace("{userId}", "DUMMY") // string

            .replace("{richMenuId}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.linkRichMenuIdToUser(
      // userId: string
      "DUMMY", // userId(string)
      // richMenuId: string
      "DUMMY", // richMenuId(string)
    );
    equal(scope.isDone(), true);
  });

  it("linkRichMenuIdToUsers", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u => u.includes("/v2/bot/richmenu/bulk/link"))
      .reply(200, {});

    const res = await client.linkRichMenuIdToUsers(
      // richMenuBulkLinkRequest: RichMenuBulkLinkRequest
      {} as unknown as RichMenuBulkLinkRequest, // paramName=richMenuBulkLinkRequest
    );
    equal(scope.isDone(), true);
  });

  it("markMessagesAsRead", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u => u.includes("/v2/bot/message/markAsRead"))
      .reply(200, {});

    const res = await client.markMessagesAsRead(
      // markMessagesAsReadRequest: MarkMessagesAsReadRequest
      {} as unknown as MarkMessagesAsReadRequest, // paramName=markMessagesAsReadRequest
    );
    equal(scope.isDone(), true);
  });

  it("multicast", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u =>
        u.includes(
          "/v2/bot/message/multicast".replace("{xLineRetryKey}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.multicast(
      // multicastRequest: MulticastRequest
      {} as unknown as MulticastRequest, // paramName=multicastRequest
      // xLineRetryKey: string
      "DUMMY", // xLineRetryKey(string)
    );
    equal(scope.isDone(), true);
  });

  it("narrowcast", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u =>
        u.includes(
          "/v2/bot/message/narrowcast".replace("{xLineRetryKey}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.narrowcast(
      // narrowcastRequest: NarrowcastRequest
      {} as unknown as NarrowcastRequest, // paramName=narrowcastRequest
      // xLineRetryKey: string
      "DUMMY", // xLineRetryKey(string)
    );
    equal(scope.isDone(), true);
  });

  it("pushMessage", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u =>
        u.includes(
          "/v2/bot/message/push".replace("{xLineRetryKey}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.pushMessage(
      // pushMessageRequest: PushMessageRequest
      {} as unknown as PushMessageRequest, // paramName=pushMessageRequest
      // xLineRetryKey: string
      "DUMMY", // xLineRetryKey(string)
    );
    equal(scope.isDone(), true);
  });

  it("pushMessagesByPhone", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u =>
        u.includes(
          "/bot/pnp/push".replace("{xLineDeliveryTag}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.pushMessagesByPhone(
      // pnpMessagesRequest: PnpMessagesRequest
      {} as unknown as PnpMessagesRequest, // paramName=pnpMessagesRequest
      // xLineDeliveryTag: string
      "DUMMY", // xLineDeliveryTag(string)
    );
    equal(scope.isDone(), true);
  });

  it("replyMessage", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u => u.includes("/v2/bot/message/reply"))
      .reply(200, {});

    const res = await client.replyMessage(
      // replyMessageRequest: ReplyMessageRequest
      {} as unknown as ReplyMessageRequest, // paramName=replyMessageRequest
    );
    equal(scope.isDone(), true);
  });

  it("richMenuBatch", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u => u.includes("/v2/bot/richmenu/batch"))
      .reply(200, {});

    const res = await client.richMenuBatch(
      // richMenuBatchRequest: RichMenuBatchRequest
      {} as unknown as RichMenuBatchRequest, // paramName=richMenuBatchRequest
    );
    equal(scope.isDone(), true);
  });

  it("setDefaultRichMenu", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u =>
        u.includes(
          "/v2/bot/user/all/richmenu/{richMenuId}".replace(
            "{richMenuId}",
            "DUMMY",
          ), // string
        ),
      )
      .reply(200, {});

    const res = await client.setDefaultRichMenu(
      // richMenuId: string
      "DUMMY", // richMenuId(string)
    );
    equal(scope.isDone(), true);
  });

  it("setWebhookEndpoint", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .put(u => u.includes("/v2/bot/channel/webhook/endpoint"))
      .reply(200, {});

    const res = await client.setWebhookEndpoint(
      // setWebhookEndpointRequest: SetWebhookEndpointRequest
      {} as unknown as SetWebhookEndpointRequest, // paramName=setWebhookEndpointRequest
    );
    equal(scope.isDone(), true);
  });

  it("testWebhookEndpoint", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u => u.includes("/v2/bot/channel/webhook/test"))
      .reply(200, {});

    const res = await client.testWebhookEndpoint(
      // testWebhookEndpointRequest: TestWebhookEndpointRequest
      {} as unknown as TestWebhookEndpointRequest, // paramName=testWebhookEndpointRequest
    );
    equal(scope.isDone(), true);
  });

  it("unlinkRichMenuIdFromUser", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .delete(u =>
        u.includes(
          "/v2/bot/user/{userId}/richmenu".replace("{userId}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.unlinkRichMenuIdFromUser(
      // userId: string
      "DUMMY", // userId(string)
    );
    equal(scope.isDone(), true);
  });

  it("unlinkRichMenuIdFromUsers", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u => u.includes("/v2/bot/richmenu/bulk/unlink"))
      .reply(200, {});

    const res = await client.unlinkRichMenuIdFromUsers(
      // richMenuBulkUnlinkRequest: RichMenuBulkUnlinkRequest
      {} as unknown as RichMenuBulkUnlinkRequest, // paramName=richMenuBulkUnlinkRequest
    );
    equal(scope.isDone(), true);
  });

  it("updateRichMenuAlias", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u =>
        u.includes(
          "/v2/bot/richmenu/alias/{richMenuAliasId}".replace(
            "{richMenuAliasId}",
            "DUMMY",
          ), // string
        ),
      )
      .reply(200, {});

    const res = await client.updateRichMenuAlias(
      // richMenuAliasId: string
      "DUMMY", // richMenuAliasId(string)
      // updateRichMenuAliasRequest: UpdateRichMenuAliasRequest
      {} as unknown as UpdateRichMenuAliasRequest, // paramName=updateRichMenuAliasRequest
    );
    equal(scope.isDone(), true);
  });

  it("validateBroadcast", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u => u.includes("/v2/bot/message/validate/broadcast"))
      .reply(200, {});

    const res = await client.validateBroadcast(
      // validateMessageRequest: ValidateMessageRequest
      {} as unknown as ValidateMessageRequest, // paramName=validateMessageRequest
    );
    equal(scope.isDone(), true);
  });

  it("validateMulticast", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u => u.includes("/v2/bot/message/validate/multicast"))
      .reply(200, {});

    const res = await client.validateMulticast(
      // validateMessageRequest: ValidateMessageRequest
      {} as unknown as ValidateMessageRequest, // paramName=validateMessageRequest
    );
    equal(scope.isDone(), true);
  });

  it("validateNarrowcast", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u => u.includes("/v2/bot/message/validate/narrowcast"))
      .reply(200, {});

    const res = await client.validateNarrowcast(
      // validateMessageRequest: ValidateMessageRequest
      {} as unknown as ValidateMessageRequest, // paramName=validateMessageRequest
    );
    equal(scope.isDone(), true);
  });

  it("validatePush", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u => u.includes("/v2/bot/message/validate/push"))
      .reply(200, {});

    const res = await client.validatePush(
      // validateMessageRequest: ValidateMessageRequest
      {} as unknown as ValidateMessageRequest, // paramName=validateMessageRequest
    );
    equal(scope.isDone(), true);
  });

  it("validateReply", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u => u.includes("/v2/bot/message/validate/reply"))
      .reply(200, {});

    const res = await client.validateReply(
      // validateMessageRequest: ValidateMessageRequest
      {} as unknown as ValidateMessageRequest, // paramName=validateMessageRequest
    );
    equal(scope.isDone(), true);
  });

  it("validateRichMenuBatchRequest", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u => u.includes("/v2/bot/richmenu/validate/batch"))
      .reply(200, {});

    const res = await client.validateRichMenuBatchRequest(
      // richMenuBatchRequest: RichMenuBatchRequest
      {} as unknown as RichMenuBatchRequest, // paramName=richMenuBatchRequest
    );
    equal(scope.isDone(), true);
  });

  it("validateRichMenuObject", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u => u.includes("/v2/bot/richmenu/validate"))
      .reply(200, {});

    const res = await client.validateRichMenuObject(
      // richMenuRequest: RichMenuRequest
      {} as unknown as RichMenuRequest, // paramName=richMenuRequest
    );
    equal(scope.isDone(), true);
  });
});
