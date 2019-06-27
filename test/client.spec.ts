import { readFileSync } from "fs";
import { join } from "path";
import { deepEqual, equal } from "assert";
import Client from "../lib/client";
import * as Types from "../lib/types";
import { getStreamData } from "./helpers/stream";
import { close, listen } from "./helpers/test-server";

const TEST_PORT = parseInt(process.env.TEST_PORT, 10);

const client = new Client({
  channelAccessToken: "test_channel_access_token",
  channelSecret: "test_channel_secret",
});

const getRecentReq = (): any =>
  JSON.parse(readFileSync(join(__dirname, "helpers/request.json")).toString());

describe("client", () => {
  before(() => listen(TEST_PORT));
  after(() => close());

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

  it("reply", async () => {
    const res = await client.replyMessage("test_reply_token", testMsg);
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/message/reply");
    equal(req.method, "POST");
    equal(req.body.replyToken, "test_reply_token");
    deepEqual(req.body.messages, [testMsg]);
    equal(res["x-line-request-id"], "X-Line-Request-Id");
  });

  it("push", async () => {
    const res = await client.pushMessage("test_user_id", testMsg);
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/message/push");
    equal(req.method, "POST");
    equal(req.body.to, "test_user_id");
    deepEqual(req.body.messages, [testMsg]);
    equal(res["x-line-request-id"], "X-Line-Request-Id");
  });

  it("multicast", async () => {
    const ids = ["test_user_id_1", "test_user_id_2", "test_user_id_3"];
    const res = await client.multicast(ids, [testMsg, testMsg]);
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/message/multicast");
    equal(req.method, "POST");
    deepEqual(req.body.to, [
      "test_user_id_1",
      "test_user_id_2",
      "test_user_id_3",
    ]);
    deepEqual(req.body.messages, [testMsg, testMsg]);
    equal(res["x-line-request-id"], "X-Line-Request-Id");
  });

  it("broadcast", async () => {
    const res = await client.broadcast([testMsg, testMsg]);
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/message/broadcast");
    equal(req.method, "POST");
    deepEqual(req.body.messages, [testMsg, testMsg]);
  });

  it("getProfile", async () => {
    const res = await client.getProfile("test_user_id");
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/profile/test_user_id");
    equal(req.method, "GET");
    deepEqual(res, {});
  });

  it("getGroupMemberProfile", async () => {
    const res = await client.getGroupMemberProfile(
      "test_group_id",
      "test_user_id",
    );
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/group/test_group_id/member/test_user_id");
    equal(req.method, "GET");
  });

  it("getRoomMemberProfile", async () => {
    const res = await client.getRoomMemberProfile(
      "test_room_id",
      "test_user_id",
    );
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/room/test_room_id/member/test_user_id");
    equal(req.method, "GET");
    deepEqual(res, {});
  });

  it("getGroupMemberIds", async () => {
    const ids = await client.getGroupMemberIds("test_group_id");
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/group/test_group_id/members/ids");
    equal(req.method, "GET");
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
    const ids = await client.getRoomMemberIds("test_room_id");
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/room/test_room_id/members/ids");
    equal(req.method, "GET");
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

  it("getMessageContent", async () => {
    const stream = await client.getMessageContent("test_message_id");
    const data = await getStreamData(stream);
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/message/test_message_id/content");
    equal(req.method, "GET");

    const res = JSON.parse(data);
  });

  it("leaveGroup", async () => {
    const res = await client.leaveGroup("test_group_id");
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/group/test_group_id/leave");
    equal(req.method, "POST");
    deepEqual(res, {});
  });

  it("leaveRoom", async () => {
    const res = await client.leaveRoom("test_room_id");
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/room/test_room_id/leave");
    equal(req.method, "POST");
    deepEqual(res, {});
  });

  it("getRichMenu", async () => {
    const res = await client.getRichMenu("test_rich_menu_id");
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/richmenu/test_rich_menu_id");
    equal(req.method, "GET");
    deepEqual(res, {});
  });

  it("createRichMenu", async () => {
    await client.createRichMenu(richMenu);
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/richmenu");
    equal(req.method, "POST");
    deepEqual(req.body, richMenu);
  });

  it("deleteRichMenu", async () => {
    const res = await client.deleteRichMenu("test_rich_menu_id");
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/richmenu/test_rich_menu_id");
    equal(req.method, "DELETE");
    deepEqual(res, {});
  });

  it("getRichMenuIdOfUser", async () => {
    await client.getRichMenuIdOfUser("test_user_id");
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/user/test_user_id/richmenu");
    equal(req.method, "GET");
  });

  it("linkRichMenuToUser", async () => {
    const res = await client.linkRichMenuToUser(
      "test_user_id",
      "test_rich_menu_id",
    );
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/user/test_user_id/richmenu/test_rich_menu_id");
    equal(req.method, "POST");
    deepEqual(res, {});
  });

  it("unlinkRichMenuFromUser", async () => {
    const res = await client.unlinkRichMenuFromUser("test_user_id");
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/user/test_user_id/richmenu");
    equal(req.method, "DELETE");
    deepEqual(res, {});
  });

  it("linkRichMenuToMultipleUsers", async () => {
    const res = await client.linkRichMenuToMultipleUsers("test_rich_menu_id", [
      "test_user_id",
    ]);
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/richmenu/bulk/link");
    equal(req.method, "POST");
    deepEqual(res, {});
    deepEqual(req.body, {
      richMenuId: "test_rich_menu_id",
      userIds: ["test_user_id"],
    });
  });

  it("unlinkRichMenusFromMultipleUsers", async () => {
    const res = await client.unlinkRichMenusFromMultipleUsers(["test_user_id"]);
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/richmenu/bulk/unlink");
    equal(req.method, "POST");
    deepEqual(res, {});
    deepEqual(req.body, {
      userIds: ["test_user_id"],
    });
  });

  it("setRichMenuImage", async () => {
    const filepath = join(__dirname, "/helpers/line-icon.png");
    const buffer = readFileSync(filepath);
    const res = await client.setRichMenuImage("test_rich_menu_id", buffer);
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/richmenu/test_rich_menu_id/content");
    equal(req.method, "POST");
    deepEqual(res, {});
  });

  it("getRichMenuImage", async () => {
    const stream = await client.getRichMenuImage("test_rich_menu_id");
    const data = await getStreamData(stream);
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/richmenu/test_rich_menu_id/content");
    equal(req.method, "GET");

    const res = JSON.parse(data);
    deepEqual(res, {});
  });

  it("getRichMenuList", async () => {
    await client.getRichMenuList();
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/richmenu/list");
    equal(req.method, "GET");
  });

  it("setDefaultRichMenu", async () => {
    const res = await client.setDefaultRichMenu("test_rich_menu_id");
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/user/all/richmenu/test_rich_menu_id");
    equal(req.method, "POST");
    deepEqual(res, {});
  });

  it("getDefaultRichMenuId", async () => {
    await client.getDefaultRichMenuId();
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/user/all/richmenu");
    equal(req.method, "GET");
  });

  it("deleteDefaultRichMenu", async () => {
    const res = await client.deleteDefaultRichMenu();
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/user/all/richmenu");
    equal(req.method, "DELETE");
    deepEqual(res, {});
  });

  it("getLinkToken", async () => {
    await client.getLinkToken("test_user_id");
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/user/test_user_id/linkToken");
    equal(req.method, "POST");
  });

  it("getNumberOfSentReplyMessages", async () => {
    const date = "20191231";
    await client.getNumberOfSentReplyMessages(date);
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/message/delivery/reply");
    equal(req.query.date, date);
    equal(req.method, "GET");
  });

  it("getNumberOfSentPushMessages", async () => {
    const date = "20191231";
    await client.getNumberOfSentPushMessages(date);
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/message/delivery/push");
    equal(req.query.date, date);
    equal(req.method, "GET");
  });

  it("getNumberOfSentMulticastMessages", async () => {
    const date = "20191231";
    await client.getNumberOfSentMulticastMessages(date);
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/message/delivery/multicast");
    equal(req.query.date, date);
    equal(req.method, "GET");
  });

  it("getTargetLimitForAdditionalMessages", async () => {
    await client.getTargetLimitForAdditionalMessages();
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/message/quota");
    equal(req.method, "GET");
  });

  it("getNumberOfMessagesSentThisMonth", async () => {
    await client.getNumberOfMessagesSentThisMonth();
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/message/quota/consumption");
    equal(req.method, "GET");
  });

  it("getNumberOfSentBroadcastMessages", async () => {
    const date = "20191231";
    await client.getNumberOfSentBroadcastMessages(date);
    const req = getRecentReq();
    equal(req.headers.authorization, "Bearer test_channel_access_token");
    equal(req.path, "/message/delivery/broadcast");
    equal(req.query.date, date);
    equal(req.method, "GET");
  });
});
