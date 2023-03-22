import { readFileSync } from "fs";
import { join } from "path";
import { deepEqual, equal, ok, strictEqual } from "assert";
import { URL } from "url";
import Client, { OAuth } from "../lib/client";
import * as Types from "../lib/types";
import { getStreamData } from "./helpers/stream";
import * as nock from "nock";
import {
  MESSAGING_API_PREFIX,
  OAUTH_BASE_PREFIX,
  OAUTH_BASE_PREFIX_V2_1,
  DATA_API_PREFIX,
} from "../lib/endpoints";
import * as FormData from "form-data";
import { createMultipartFormData } from "../lib/utils";

const pkg = require("../package.json");

const channelAccessToken = "test_channel_access_token";

const client = new Client({
  channelAccessToken,
});

const responseFn = function (
  this: nock.ReplyFnContext,
  uri: string,
  _body: nock.Body,
  cb: (err: NodeJS.ErrnoException | null, result: nock.ReplyFnResult) => void,
) {
  const fullUrl =
    // @ts-ignore
    this.req.options.protocol +
    "//" +
    // @ts-ignore
    this.req.options.hostname +
    // @ts-ignore
    this.req.options.path;

  if (fullUrl.startsWith(MESSAGING_API_PREFIX + "/message/"))
    cb(null, [
      200,
      {},
      {
        "X-Line-Request-Id": "X-Line-Request-Id",
      },
    ]);
  else cb(null, [200, {}]);
};

describe("client", () => {
  before(() => nock.disableNetConnect());
  afterEach(() => nock.cleanAll());
  after(() => nock.enableNetConnect());

  const testMsg: Types.TextMessage = { type: "text", text: "hello" };
  const richMenu: Types.RichMenu = {
    size: {
      width: 2500,
      height: 1686,
    },
    selected: false,
    name: "Nice richmenu",
    chatBarText: "Tap here",
    areas: [
      {
        bounds: {
          x: 0,
          y: 0,
          width: 2500,
          height: 1686,
        },
        action: {
          type: "postback",
          data: "action=buy&itemid=123",
        },
      },
    ],
  };

  const interceptionOption = {
    reqheaders: {
      authorization: `Bearer ${channelAccessToken}`,
      "User-Agent": `${pkg.name}/${pkg.version}`,
    },
  };

  const mockGet = (
    prefix: string,
    path: string,
    expectedQuery?: boolean | string | nock.DataMatcherMap | URLSearchParams,
  ) => {
    let _it = nock(prefix, interceptionOption).get(path);
    if (expectedQuery) {
      _it = _it.query(expectedQuery);
    }
    return _it.reply(responseFn);
  };

  const mockPost = (
    prefix: string,
    path: string,
    expectedBody?: nock.RequestBodyMatcher,
  ) => {
    return nock(prefix, interceptionOption)
      .post(path, expectedBody)
      .reply(responseFn);
  };

  const multipartFormDataMatcher =
    (expectedBody: Record<string, any>) => (body: any) => {
      const decoded = Buffer.from(body, "hex");
      const boundary = decoded.toString("utf-8").match(/^--(.+)/)[1];
      const data = new FormData();
      //@ts-ignore
      data._boundary = boundary;
      createMultipartFormData.call(data, expectedBody);
      return data.getBuffer().compare(decoded) === 0;
    };

  const mockPut = (
    prefix: string,
    path: string,
    expectedBody?: nock.RequestBodyMatcher,
  ) => {
    return nock(prefix, interceptionOption)
      .put(path, expectedBody)
      .reply(responseFn);
  };

  const mockDelete = (
    prefix: string,
    path: string,
    expectedQuery?: boolean | string | nock.DataMatcherMap | URLSearchParams,
  ) => {
    let _it = nock(prefix, interceptionOption).delete(path);
    if (expectedQuery) {
      _it = _it.query(expectedQuery);
    }
    return _it.reply(responseFn);
  };

  it("reply", async () => {
    const scope = mockPost(MESSAGING_API_PREFIX, `/message/reply`, {
      messages: [testMsg],
      replyToken: "test_reply_token",
      notificationDisabled: false,
    });

    const res = await client.replyMessage("test_reply_token", testMsg);
    equal(scope.isDone(), true);
    equal(res["x-line-request-id"], "X-Line-Request-Id");
  });

  it("validateReplyMessageObjects", async () => {
    const scope = mockPost(MESSAGING_API_PREFIX, `/message/validate/reply`, {
      messages: [testMsg],
    });

    const res = await client.validateReplyMessageObjects(testMsg);
    strictEqual(scope.isDone(), true);
    strictEqual(res["x-line-request-id"], "X-Line-Request-Id");
  });

  it("push", async () => {
    const scope = mockPost(MESSAGING_API_PREFIX, `/message/push`, {
      messages: [testMsg],
      to: "test_user_id",
      notificationDisabled: false,
    });

    const res = await client.pushMessage("test_user_id", testMsg);
    equal(scope.isDone(), true);
    equal(res["x-line-request-id"], "X-Line-Request-Id");
  });

  it("validatePushMessageObjects", async () => {
    const scope = mockPost(MESSAGING_API_PREFIX, `/message/validate/push`, {
      messages: [testMsg],
    });

    const res = await client.validatePushMessageObjects(testMsg);
    strictEqual(scope.isDone(), true);
    strictEqual(res["x-line-request-id"], "X-Line-Request-Id");
  });

  it("multicast", async () => {
    const ids = ["test_user_id_1", "test_user_id_2", "test_user_id_3"];
    const scope = mockPost(MESSAGING_API_PREFIX, `/message/multicast`, {
      messages: [testMsg, testMsg],
      to: ids,
      notificationDisabled: false,
    });

    const res = await client.multicast(ids, [testMsg, testMsg]);
    equal(scope.isDone(), true);
    equal(res["x-line-request-id"], "X-Line-Request-Id");
  });

  it("validateMulticastMessageObjects", async () => {
    const scope = mockPost(
      MESSAGING_API_PREFIX,
      `/message/validate/multicast`,
      {
        messages: [testMsg, testMsg],
      },
    );

    const res = await client.validateMulticastMessageObjects([
      testMsg,
      testMsg,
    ]);
    strictEqual(scope.isDone(), true);
    strictEqual(res["x-line-request-id"], "X-Line-Request-Id");
  });

  it("narrowcast", async () => {
    const recipient: Types.ReceieptObject = {
      type: "operator",
      and: [
        {
          type: "audience",
          audienceGroupId: 5614991017776,
        },
        {
          type: "operator",
          not: {
            type: "audience",
            audienceGroupId: 4389303728991,
          },
        },
      ],
    };
    const filter = {
      demographic: {
        type: "operator",
        or: [
          {
            type: "operator",
            and: [
              {
                type: "gender",
                oneOf: ["male", "female"],
              },
              {
                type: "age",
                gte: "age_20",
                lt: "age_25",
              },
              {
                type: "appType",
                oneOf: ["android", "ios"],
              },
              {
                type: "area",
                oneOf: ["jp_23", "jp_05"],
              },
              {
                type: "subscriptionPeriod",
                gte: "day_7",
                lt: "day_30",
              },
            ],
          },
          {
            type: "operator",
            and: [
              {
                type: "age",
                gte: "age_35",
                lt: "age_40",
              },
              {
                type: "operator",
                not: {
                  type: "gender",
                  oneOf: ["male"],
                },
              },
            ],
          },
        ],
      } as Types.DemographicFilterObject,
    };

    const limit = {
      max: 100,
    };
    const scope = mockPost(MESSAGING_API_PREFIX, `/message/narrowcast`, {
      messages: [testMsg, testMsg],
      recipient,
      filter,
      limit,
    });

    const res = await client.narrowcast(
      [testMsg, testMsg],
      recipient,
      filter,
      limit,
    );
    equal(scope.isDone(), true);
    equal(res["x-line-request-id"], "X-Line-Request-Id");
  });

  it("validateNarrowcastMessageObjects", async () => {
    const scope = mockPost(
      MESSAGING_API_PREFIX,
      `/message/validate/narrowcast`,
      {
        messages: [testMsg, testMsg],
      },
    );

    const res = await client.validateNarrowcastMessageObjects([
      testMsg,
      testMsg,
    ]);
    strictEqual(scope.isDone(), true);
    strictEqual(res["x-line-request-id"], "X-Line-Request-Id");
  });

  it("broadcast", async () => {
    const scope = mockPost(MESSAGING_API_PREFIX, `/message/broadcast`, {
      messages: [testMsg, testMsg],
      notificationDisabled: false,
    });

    const res = await client.broadcast([testMsg, testMsg]);
    equal(scope.isDone(), true);
    equal(res["x-line-request-id"], "X-Line-Request-Id");
  });

  it("validateBroadcastMessageObjects", async () => {
    const scope = mockPost(
      MESSAGING_API_PREFIX,
      `/message/validate/broadcast`,
      {
        messages: [testMsg, testMsg],
      },
    );

    const res = await client.validateBroadcastMessageObjects([
      testMsg,
      testMsg,
    ]);
    strictEqual(scope.isDone(), true);
    strictEqual(res["x-line-request-id"], "X-Line-Request-Id");
  });

  it("getProfile", async () => {
    const scope = mockGet(MESSAGING_API_PREFIX, "/profile/test_user_id");

    const res = await client.getProfile("test_user_id");
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("getGroupMemberProfile", async () => {
    const scope = mockGet(
      MESSAGING_API_PREFIX,
      "/group/test_group_id/member/test_user_id",
    );

    const res = await client.getGroupMemberProfile(
      "test_group_id",
      "test_user_id",
    );
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("getRoomMemberProfile", async () => {
    const scope = mockGet(
      MESSAGING_API_PREFIX,
      "/room/test_room_id/member/test_user_id",
    );

    const res = await client.getRoomMemberProfile(
      "test_room_id",
      "test_user_id",
    );
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  const mockGroupMemberAPI = () => {
    const matchReg = /([A-Za-z0-9_]+)\/([A-Za-z0-9_]+)\/members\/ids/;

    return nock(MESSAGING_API_PREFIX, interceptionOption)
      .get(matchReg)
      .times(3)
      .reply(200, (uri, _requestBody) => {
        const _url = new URL(MESSAGING_API_PREFIX + uri);
        let [_matchPath, groupOrRoom, id] = _url.pathname.match(matchReg);

        const ty: string = groupOrRoom;
        const start: number = parseInt(_url.searchParams.get("start"), 10) || 0;

        const result: { memberIds: string[]; next?: string } = {
          memberIds: [start, start + 1, start + 2].map(i => `${ty}-${id}-${i}`),
        };

        if (start / 3 < 2) {
          result.next = String(start + 3);
        }
        return result;
      });
  };

  it("getGroupMemberIds", async () => {
    const scope = mockGroupMemberAPI();

    const ids = await client.getGroupMemberIds("test_group_id");
    equal(scope.isDone(), true);
    deepEqual(ids, [
      "group-test_group_id-0",
      "group-test_group_id-1",
      "group-test_group_id-2",
      "group-test_group_id-3",
      "group-test_group_id-4",
      "group-test_group_id-5",
      "group-test_group_id-6",
      "group-test_group_id-7",
      "group-test_group_id-8",
    ]);
  });

  it("getRoomMemberIds", async () => {
    const scope = mockGroupMemberAPI();

    const ids = await client.getRoomMemberIds("test_room_id");
    equal(scope.isDone(), true);
    deepEqual(ids, [
      "room-test_room_id-0",
      "room-test_room_id-1",
      "room-test_room_id-2",
      "room-test_room_id-3",
      "room-test_room_id-4",
      "room-test_room_id-5",
      "room-test_room_id-6",
      "room-test_room_id-7",
      "room-test_room_id-8",
    ]);
  });

  it("getBotFollowersIds", async () => {
    const scope = mockGet(MESSAGING_API_PREFIX, "/followers/ids?limit=1000");
    const ids = await client.getBotFollowersIds();
    equal(scope.isDone(), true);
  });

  it("getGroupMembersCount", async () => {
    const groupId = "groupId";
    const scope = mockGet(
      MESSAGING_API_PREFIX,
      `/group/${groupId}/members/count`,
    );

    await client.getGroupMembersCount(groupId);
    equal(scope.isDone(), true);
  });

  it("getRoomMembersCount", async () => {
    const roomId = "roomId";
    const scope = mockGet(
      MESSAGING_API_PREFIX,
      `/room/${roomId}/members/count`,
    );

    await client.getRoomMembersCount(roomId);
    equal(scope.isDone(), true);
  });

  it("getGroupSummary", async () => {
    const groupId = "groupId";
    const scope = mockGet(MESSAGING_API_PREFIX, `/group/${groupId}/summary`);

    await client.getGroupSummary(groupId);
    equal(scope.isDone(), true);
  });

  it("getMessageContent", async () => {
    const scope = mockGet(DATA_API_PREFIX, "/message/test_message_id/content");

    const stream = await client.getMessageContent("test_message_id");
    const data = await getStreamData(stream);
    equal(scope.isDone(), true);
    const res = JSON.parse(data);
    deepEqual(res, {});
  });

  it("leaveGroup", async () => {
    const scope = mockPost(MESSAGING_API_PREFIX, "/group/test_group_id/leave");

    const res = await client.leaveGroup("test_group_id");
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("leaveRoom", async () => {
    const scope = mockPost(MESSAGING_API_PREFIX, "/room/test_room_id/leave");
    const res = await client.leaveRoom("test_room_id");
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("getRichMenu", async () => {
    const scope = mockGet(MESSAGING_API_PREFIX, "/richmenu/test_rich_menu_id");
    const res = await client.getRichMenu("test_rich_menu_id");
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("createRichMenu", async () => {
    const scope = mockPost(MESSAGING_API_PREFIX, "/richmenu", richMenu);
    await client.createRichMenu(richMenu);

    equal(scope.isDone(), true);
  });

  it("deleteRichMenu", async () => {
    // delete
    const scope = mockDelete(
      MESSAGING_API_PREFIX,
      "/richmenu/test_rich_menu_id",
    );
    const res = await client.deleteRichMenu("test_rich_menu_id");
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("getRichMenuAliasList", async () => {
    const scope = mockGet(MESSAGING_API_PREFIX, "/richmenu/alias/list");
    const res = await client.getRichMenuAliasList();
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("getRichMenuAlias", async () => {
    const richMenuAliasId = "test_rich_menu_alias_id";
    const scope = mockGet(
      MESSAGING_API_PREFIX,
      `/richmenu/alias/${richMenuAliasId}`,
    );
    const res = await client.getRichMenuAlias(richMenuAliasId);
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("createRichMenuAlias", async () => {
    const richMenuId = "test_rich_menu_id";
    const richMenuAliasId = "test_rich_menu_alias_id";
    const scope = mockPost(MESSAGING_API_PREFIX, "/richmenu/alias", {
      richMenuId,
      richMenuAliasId,
    });
    await client.createRichMenuAlias(richMenuId, richMenuAliasId);

    equal(scope.isDone(), true);
  });

  it("deleteRichMenuAlias", async () => {
    const scope = mockDelete(
      MESSAGING_API_PREFIX,
      "/richmenu/alias/test_rich_menu_alias_id",
    );
    const res = await client.deleteRichMenuAlias("test_rich_menu_alias_id");
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("updateRichMenuAlias", async () => {
    const richMenuId = "test_rich_menu_id";
    const richMenuAliasId = "test_rich_menu_alias_id";
    const scope = mockPost(
      MESSAGING_API_PREFIX,
      "/richmenu/alias/test_rich_menu_alias_id",
      { richMenuId },
    );

    const res = await client.updateRichMenuAlias(richMenuAliasId, richMenuId);
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("getRichMenuIdOfUser", async () => {
    const scope = mockGet(MESSAGING_API_PREFIX, "/user/test_user_id/richmenu");
    await client.getRichMenuIdOfUser("test_user_id");
    equal(scope.isDone(), true);
  });

  it("linkRichMenuToUser", async () => {
    const scope = mockPost(
      MESSAGING_API_PREFIX,
      "/user/test_user_id/richmenu/test_rich_menu_id",
    );

    const res = await client.linkRichMenuToUser(
      "test_user_id",
      "test_rich_menu_id",
    );
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("unlinkRichMenuFromUser", async () => {
    const scope = mockDelete(
      MESSAGING_API_PREFIX,
      "/user/test_user_id/richmenu",
    );

    const res = await client.unlinkRichMenuFromUser("test_user_id");
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("linkRichMenuToMultipleUsers", async () => {
    const richMenuId = "test_rich_menu_id",
      userIds = ["test_user_id"];
    const scope = mockPost(MESSAGING_API_PREFIX, "/richmenu/bulk/link", {
      richMenuId,
      userIds,
    });

    const res = await client.linkRichMenuToMultipleUsers(richMenuId, userIds);
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("unlinkRichMenusFromMultipleUsers", async () => {
    const userIds = ["test_user_id"];
    const scope = mockPost(MESSAGING_API_PREFIX, "/richmenu/bulk/unlink", {
      userIds,
    });

    const res = await client.unlinkRichMenusFromMultipleUsers(userIds);
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("setRichMenuImage", async () => {
    const filepath = join(__dirname, "/helpers/line-icon.png");
    const buffer = readFileSync(filepath);
    const scope = mockPost(
      DATA_API_PREFIX,
      "/richmenu/test_rich_menu_id/content",
      buffer,
    );

    const res = await client.setRichMenuImage("test_rich_menu_id", buffer);
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("getRichMenuImage", async () => {
    const scope = mockGet(
      DATA_API_PREFIX,
      "/richmenu/test_rich_menu_id/content",
    );

    const stream = await client.getRichMenuImage("test_rich_menu_id");
    const data = await getStreamData(stream);
    equal(scope.isDone(), true);
    const res = JSON.parse(data);
    deepEqual(res, {});
  });

  it("getRichMenuList", async () => {
    const scope = mockGet(MESSAGING_API_PREFIX, "/richmenu/list");

    await client.getRichMenuList();
    equal(scope.isDone(), true);
  });

  it("setDefaultRichMenu", async () => {
    const scope = mockPost(
      MESSAGING_API_PREFIX,
      "/user/all/richmenu/test_rich_menu_id",
    );

    const res = await client.setDefaultRichMenu("test_rich_menu_id");
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("getDefaultRichMenuId", async () => {
    const scope = mockGet(MESSAGING_API_PREFIX, "/user/all/richmenu");

    await client.getDefaultRichMenuId();
    equal(scope.isDone(), true);
  });

  it("deleteDefaultRichMenu", async () => {
    const scope = mockDelete(MESSAGING_API_PREFIX, "/user/all/richmenu");

    const res = await client.deleteDefaultRichMenu();
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("getLinkToken", async () => {
    const scope = mockPost(
      MESSAGING_API_PREFIX,
      "/user/test_user_id/linkToken",
    );

    await client.getLinkToken("test_user_id");
    equal(scope.isDone(), true);
  });

  it("getNumberOfSentReplyMessages", async () => {
    const date = "20191231";
    const scope = mockGet(MESSAGING_API_PREFIX, "/message/delivery/reply", {
      date,
    });

    await client.getNumberOfSentReplyMessages(date);
    equal(scope.isDone(), true);
  });

  it("getNumberOfSentPushMessages", async () => {
    const date = "20191231";
    const scope = mockGet(MESSAGING_API_PREFIX, "/message/delivery/push", {
      date,
    });

    await client.getNumberOfSentPushMessages(date);
    equal(scope.isDone(), true);
  });

  it("getNumberOfSentMulticastMessages", async () => {
    const date = "20191231";
    const scope = mockGet(MESSAGING_API_PREFIX, "/message/delivery/multicast", {
      date,
    });

    await client.getNumberOfSentMulticastMessages(date);
    equal(scope.isDone(), true);
  });

  it("getNarrowcastProgress", async () => {
    const requestId = "requestId";
    const scope = mockGet(
      MESSAGING_API_PREFIX,
      "/message/progress/narrowcast",
      {
        requestId,
      },
    );

    await client.getNarrowcastProgress(requestId);
    equal(scope.isDone(), true);
  });

  it("getTargetLimitForAdditionalMessages", async () => {
    const scope = mockGet(MESSAGING_API_PREFIX, "/message/quota");

    await client.getTargetLimitForAdditionalMessages();
    equal(scope.isDone(), true);
  });

  it("getNumberOfMessagesSentThisMonth", async () => {
    const scope = mockGet(MESSAGING_API_PREFIX, "/message/quota/consumption");

    await client.getNumberOfMessagesSentThisMonth();
    equal(scope.isDone(), true);
  });

  it("getNumberOfSentBroadcastMessages", async () => {
    const date = "20191231";
    const scope = mockGet(MESSAGING_API_PREFIX, "/message/delivery/broadcast", {
      date,
    });

    await client.getNumberOfSentBroadcastMessages(date);
    equal(scope.isDone(), true);
  });

  it("getNumberOfMessageDeliveries", async () => {
    const date = "20191231";
    const scope = mockGet(MESSAGING_API_PREFIX, "/insight/message/delivery", {
      date,
    });

    await client.getNumberOfMessageDeliveries(date);
    equal(scope.isDone(), true);
  });

  it("getNumberOfFollowers", async () => {
    const date = "20191231";
    const scope = mockGet(MESSAGING_API_PREFIX, "/insight/followers", {
      date,
    });

    await client.getNumberOfFollowers(date);
    equal(scope.isDone(), true);
  });

  it("getFriendDemographics", async () => {
    const scope = mockGet(MESSAGING_API_PREFIX, "/insight/demographic");

    await client.getFriendDemographics();
    equal(scope.isDone(), true);
  });

  it("getUserInteractionStatistics", async () => {
    const requestId = "requestId";
    const scope = mockGet(MESSAGING_API_PREFIX, "/insight/message/event", {
      requestId,
    });

    await client.getUserInteractionStatistics(requestId);
    equal(scope.isDone(), true);
  });

  it("getStatisticsPerUnit", async () => {
    const customAggregationUnit = "promotion_a";
    const from = "20210301";
    const to = "20210331";
    const scope = mockGet(
      MESSAGING_API_PREFIX,
      "/insight/message/event/aggregation",
      {
        customAggregationUnit,
        from,
        to,
      },
    );

    await client.getStatisticsPerUnit(customAggregationUnit, from, to);
    equal(scope.isDone(), true);
  });

  it("createUploadAudienceGroup", async () => {
    const requestBody = {
      description: "audienceGroupName",
      isIfaAudience: false,
      audiences: [
        {
          id: "id",
        },
      ],
      uploadDescription: "uploadDescription",
    };
    const scope = mockPost(
      MESSAGING_API_PREFIX,
      "/audienceGroup/upload",
      requestBody,
    );

    await client.createUploadAudienceGroup(requestBody);
    equal(scope.isDone(), true);
  });

  it("createUploadAudienceGroupByFile", async () => {
    const filepath = join(__dirname, "/helpers/line-icon.png");
    const buffer = readFileSync(filepath);

    const requestBody = {
      description: "audienceGroupName",
      isIfaAudience: false,
      uploadDescription: "uploadDescription",
      file: buffer,
    };

    const scope = nock(DATA_API_PREFIX, {
      reqheaders: {
        ...interceptionOption.reqheaders,
        "content-type": value =>
          value.startsWith(`multipart/form-data; boundary=`),
      },
    })
      .post(
        "/audienceGroup/upload/byFile",
        multipartFormDataMatcher(requestBody),
      )
      .reply(responseFn);

    await client.createUploadAudienceGroupByFile(requestBody);
    equal(scope.isDone(), true);
  });

  it("updateUploadAudienceGroup", async () => {
    const requestBody = {
      audienceGroupId: 4389303728991,
      description: "audienceGroupName",
      uploadDescription: "fileName",
      audiences: [
        {
          id: "u1000",
        },
        {
          id: "u2000",
        },
      ],
    };
    const scope = mockPut(
      MESSAGING_API_PREFIX,
      "/audienceGroup/upload",
      requestBody,
    );

    await client.updateUploadAudienceGroup(requestBody);
    equal(scope.isDone(), true);
  });

  it("updateUploadAudienceGroupByFile", async () => {
    const filepath = join(__dirname, "/helpers/line-icon.png");
    const buffer = readFileSync(filepath);
    const requestBody = {
      audienceGroupId: 4389303728991,
      uploadDescription: "fileName",
      file: buffer,
    };
    const scope = nock(DATA_API_PREFIX, {
      reqheaders: {
        ...interceptionOption.reqheaders,
        "content-type": value =>
          value.startsWith(`multipart/form-data; boundary=`),
      },
    })
      .put(
        "/audienceGroup/upload/byFile",
        multipartFormDataMatcher(requestBody),
      )
      .reply(responseFn);

    await client.updateUploadAudienceGroupByFile(requestBody);
    equal(scope.isDone(), true);
  });

  it("createClickAudienceGroup", async () => {
    const requestBody = {
      description: "audienceGroupName",
      requestId: "requestId",
    };
    const scope = mockPost(
      MESSAGING_API_PREFIX,
      "/audienceGroup/click",
      requestBody,
    );

    await client.createClickAudienceGroup(requestBody);
    equal(scope.isDone(), true);
  });

  it("createImpAudienceGroup", async () => {
    const requestBody = {
      requestId: "requestId",
      description: "description",
    };
    const scope = mockPost(
      MESSAGING_API_PREFIX,
      "/audienceGroup/imp",
      requestBody,
    );

    await client.createImpAudienceGroup(requestBody);
    equal(scope.isDone(), true);
  });

  it("setDescriptionAudienceGroup", async () => {
    const { description, audienceGroupId } = {
      description: "description",
      audienceGroupId: "audienceGroupId",
    };
    const scope = mockPut(
      MESSAGING_API_PREFIX,
      `/audienceGroup/${audienceGroupId}/updateDescription`,
      {
        description,
      },
    );

    await client.setDescriptionAudienceGroup(description, audienceGroupId);
    equal(scope.isDone(), true);
  });

  it("deleteAudienceGroup", async () => {
    const audienceGroupId = "audienceGroupId";
    const scope = mockDelete(
      MESSAGING_API_PREFIX,
      `/audienceGroup/${audienceGroupId}`,
    );
    const res = await client.deleteAudienceGroup(audienceGroupId);
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("getAudienceGroup", async () => {
    const audienceGroupId = "audienceGroupId";
    const scope = mockGet(
      MESSAGING_API_PREFIX,
      `/audienceGroup/${audienceGroupId}`,
    );

    await client.getAudienceGroup(audienceGroupId);
    equal(scope.isDone(), true);
  });

  it("getAudienceGroups", async () => {
    const page = 1;
    const description = "description";
    const status: Types.AudienceGroupStatus = "READY";
    const size = 1;
    const createRoute: Types.AudienceGroupCreateRoute = "MESSAGING_API";
    const includesExternalPublicGroups = true;

    const scope = mockGet(MESSAGING_API_PREFIX, `/audienceGroup/list`, {
      page,
      description,
      status,
      size,
      createRoute,
      includesExternalPublicGroups,
    });

    await client.getAudienceGroups(
      page,
      description,
      status,
      size,
      createRoute,
      includesExternalPublicGroups,
    );
    equal(scope.isDone(), true);
  });

  it("getAudienceGroupAuthorityLevel", async () => {
    const scope = mockGet(
      MESSAGING_API_PREFIX,
      `/audienceGroup/authorityLevel`,
    );

    await client.getAudienceGroupAuthorityLevel();
    equal(scope.isDone(), true);
  });

  it("changeAudienceGroupAuthorityLevel", async () => {
    const authorityLevel: Types.AudienceGroupAuthorityLevel = "PRIVATE";
    const scope = mockPut(
      MESSAGING_API_PREFIX,
      `/audienceGroup/authorityLevel`,
      {
        authorityLevel,
      },
    );

    await client.changeAudienceGroupAuthorityLevel(authorityLevel);
    equal(scope.isDone(), true);
  });

  it("setWebhookEndpointUrl", async () => {
    const endpoint = "https://developers.line.biz/";
    const scope = mockPut(MESSAGING_API_PREFIX, `/channel/webhook/endpoint`, {
      endpoint,
    });

    await client.setWebhookEndpointUrl(endpoint);
    equal(scope.isDone(), true);
  });

  it("getWebhookEndpointInfo", async () => {
    const scope = mockGet(MESSAGING_API_PREFIX, `/channel/webhook/endpoint`);

    await client.getWebhookEndpointInfo();
    equal(scope.isDone(), true);
  });

  it("testWebhookEndpoint", async () => {
    const endpoint = "https://developers.line.biz/";
    const scope = mockPost(MESSAGING_API_PREFIX, `/channel/webhook/test`, {
      endpoint,
    });

    await client.testWebhookEndpoint(endpoint);
    equal(scope.isDone(), true);
  });

  it("set option once and clear option", async () => {
    const expectedBody = {
      messages: [testMsg],
      to: "test_user_id",
      notificationDisabled: false,
    };
    const retryKey = "retryKey";

    const firstRequest = nock(MESSAGING_API_PREFIX, {
      reqheaders: {
        ...interceptionOption.reqheaders,
        "X-Line-Retry-Key": retryKey,
      },
    })
      .post(`/message/push`, expectedBody)
      .reply(responseFn);
    const secondRequest = mockPost(MESSAGING_API_PREFIX, `/message/push`, {
      messages: [testMsg],
      to: "test_user_id",
      notificationDisabled: false,
    });

    client.setRequestOptionOnce({
      retryKey,
    });

    const firstResPromise = client.pushMessage("test_user_id", testMsg);
    const secondResPromise = client.pushMessage("test_user_id", testMsg);

    const [firstRes, secondRes] = await Promise.all([
      firstResPromise,
      secondResPromise,
    ]);
    equal(firstRequest.isDone(), true);
    equal(secondRequest.isDone(), true);
    equal(firstRes["x-line-request-id"], "X-Line-Request-Id");
    equal(secondRes["x-line-request-id"], "X-Line-Request-Id");
  });

  it("fails on construct with no channelAccessToken", () => {
    try {
      new Client({ channelAccessToken: null });
      ok(false);
    } catch (err) {
      equal(err.message, "no channel access token");
    }
  });

  it("fails on pass non-Buffer to setRichMenu", async () => {
    try {
      await client.setRichMenuImage("test_rich_menu_id", null);
      ok(false);
    } catch (err) {
      equal(err.message, "invalid data type for binary data");
    }
  });

  it("getBotInfo", async () => {
    const scope = mockGet(MESSAGING_API_PREFIX, `/info`);

    await client.getBotInfo();
    equal(scope.isDone(), true);
  });
});

const oauth = new OAuth();
describe("oauth", () => {
  before(() => nock.disableNetConnect());
  afterEach(() => nock.cleanAll());
  after(() => nock.enableNetConnect());

  const interceptionOption = {
    reqheaders: {
      "content-type": "application/x-www-form-urlencoded",
      "User-Agent": `${pkg.name}/${pkg.version}`,
    },
  };

  it("issueAccessToken", async () => {
    const client_id = "test_client_id";
    const client_secret = "test_client_secret";
    const reply = {
      access_token: "access_token",
      expires_in: 2592000,
      token_type: "Bearer",
    };

    const scope = nock(OAUTH_BASE_PREFIX, interceptionOption)
      .post("/accessToken", {
        grant_type: "client_credentials",
        client_id,
        client_secret,
      })
      .reply(200, reply);

    const res = await oauth.issueAccessToken(client_id, client_secret);
    equal(scope.isDone(), true);
    deepEqual(res, reply);
  });

  it("revokeAccessToken", async () => {
    const access_token = "test_channel_access_token";
    const scope = nock(OAUTH_BASE_PREFIX, interceptionOption)
      .post("/revoke", { access_token })
      .reply(200, {});

    const res = await oauth.revokeAccessToken(access_token);
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("verifyAccessToken", async () => {
    const access_token = "test_channel_access_token";
    const scope = nock(OAUTH_BASE_PREFIX_V2_1)
      .get("/verify")
      .query({
        access_token,
      })
      .reply(200, {});

    const res = await oauth.verifyAccessToken(access_token);
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("verifyIdToken", async () => {
    const id_token = "test_channel_access_token";
    const client_id = "test_client_id";
    const nonce = "test_nonce";
    const user_id = "test_user_id";
    const scope = nock(OAUTH_BASE_PREFIX_V2_1, interceptionOption)
      .post("/verify", {
        id_token,
        client_id,
        nonce,
        user_id,
      })
      .reply(200, {});

    const res = await oauth.verifyIdToken(id_token, client_id, nonce, user_id);
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("issueChannelAccessTokenV2_1", async () => {
    const client_assertion = "client_assertion";
    const reply = {
      access_token: "access_token",
      expires_in: 2592000,
      token_type: "Bearer",
      key_id: "key_id",
    };

    const scope = nock(OAUTH_BASE_PREFIX_V2_1, interceptionOption)
      .post("/token", {
        grant_type: "client_credentials",
        client_assertion_type:
          "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        client_assertion,
      })
      .reply(200, reply);

    const res = await oauth.issueChannelAccessTokenV2_1(client_assertion);
    equal(scope.isDone(), true);
    deepEqual(res, reply);
  });

  it("getChannelAccessTokenKeyIdsV2_1", async () => {
    const client_assertion = "client_assertion";
    const reply = {
      key_ids: ["key_id"],
    };

    const scope = nock(OAUTH_BASE_PREFIX_V2_1)
      .get("/tokens/kid")
      .query({
        client_assertion_type:
          "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        client_assertion,
      })
      .reply(200, reply);

    const res = await oauth.getChannelAccessTokenKeyIdsV2_1(client_assertion);
    equal(scope.isDone(), true);
    deepEqual(res, reply);
  });

  it("revokeChannelAccessTokenV2_1", async () => {
    const client_id = "test_client_id",
      client_secret = "test_client_secret",
      access_token = "test_channel_access_token";
    const scope = nock(OAUTH_BASE_PREFIX_V2_1, interceptionOption)
      .post("/revoke", { client_id, client_secret, access_token })
      .reply(200, {});

    const res = await oauth.revokeChannelAccessTokenV2_1(
      client_id,
      client_secret,
      access_token,
    );
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });
});
