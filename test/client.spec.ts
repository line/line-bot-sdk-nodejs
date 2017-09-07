import { deepEqual, equal } from "assert";
import Client from "../lib/client";
import { getStreamData } from "./helpers/stream";
import { close, listen } from "./helpers/test-server";

const TEST_PORT = parseInt(process.env.TEST_PORT, 10);

const client = new Client({
  channelAccessToken: "test_channel_access_token",
  channelSecret: "test_channel_secret",
});

describe("client", () => {
  before(() => listen(TEST_PORT));
  after(() => close());

  const testMsg: Line.TextMessage = { type: "text", text: "hello" };

  it("reply", () => {
    return client.replyMessage("test_reply_token", testMsg)
      .then((res: any) => {
        equal(res.headers.authorization, "Bearer test_channel_access_token");
        equal(res.path, "/message/reply");
        equal(res.method, "POST");
        equal(res.body.replyToken, "test_reply_token");
        deepEqual(res.body.messages, [testMsg]);
      });
  });

  it("push", () => {
    return client.pushMessage("test_user_id", testMsg)
      .then((res: any) => {
        equal(res.headers.authorization, "Bearer test_channel_access_token");
        equal(res.path, "/message/push");
        equal(res.method, "POST");
        equal(res.body.to, "test_user_id");
        deepEqual(res.body.messages, [testMsg]);
      });
  });

  it("multicast", () => {
    const ids = ["test_user_id_1", "test_user_id_2", "test_user_id_3"];
    return client.multicast(ids, [testMsg, testMsg])
      .then((res: any) => {
        equal(res.headers.authorization, "Bearer test_channel_access_token");
        equal(res.path, "/message/multicast");
        equal(res.method, "POST");
        deepEqual(res.body.to, ["test_user_id_1", "test_user_id_2", "test_user_id_3"]);
        deepEqual(res.body.messages, [testMsg, testMsg]);
      });
  });

  it("getProfile", () => {
    return client.getProfile("test_user_id")
      .then((res: any) => {
        equal(res.headers.authorization, "Bearer test_channel_access_token");
        equal(res.path, "/profile/test_user_id");
        equal(res.method, "GET");
      });
  });

  it("getGroupMemberProfile", () => {
    return client.getGroupMemberProfile("test_group_id", "test_user_id")
      .then((res: any) => {
        equal(res.headers.authorization, "Bearer test_channel_access_token");
        equal(res.path, "/group/test_group_id/member/test_user_id");
        equal(res.method, "GET");
      });
  });

  it("getRoomMemberProfile", () => {
    return client.getRoomMemberProfile("test_room_id", "test_user_id")
      .then((res: any) => {
        equal(res.headers.authorization, "Bearer test_channel_access_token");
        equal(res.path, "/room/test_room_id/member/test_user_id");
        equal(res.method, "GET");
      });
  });

  it("getGroupMemberIds", () => {
    return client.getGroupMemberIds("test_group_id", "")
      .then((res: any) => {
        equal(res.headers.authorization, "Bearer test_channel_access_token");
        equal(res.path, "/group/test_group_id/members/ids");
        equal(res.method, "GET");
      });
  });

  it("getRoomMemberIds", () => {
    return client.getRoomMemberIds("test_room_id", "")
      .then((res: any) => {
        equal(res.headers.authorization, "Bearer test_channel_access_token");
        equal(res.path, "/room/test_room_id/members/ids");
        equal(res.method, "GET");
      });
  });

  it("getMessageContent", () => {
    return client.getMessageContent("test_message_id")
      .then((s) => getStreamData(s))
      .then((data) => {
        const res = JSON.parse(data);
        equal(res.headers.authorization, "Bearer test_channel_access_token");
        equal(res.path, "/message/test_message_id/content");
        equal(res.method, "GET");
      });
  });

  it("leaveGroup", () => {
    return client.leaveGroup("test_group_id")
      .then((res) => {
        equal(res.headers.authorization, "Bearer test_channel_access_token");
        equal(res.path, "/group/test_group_id/leave");
        equal(res.method, "POST");
      });
  });

  it("leaveRoom", () => {
    return client.leaveRoom("test_room_id")
      .then((res: any) => {
        equal(res.headers.authorization, "Bearer test_channel_access_token");
        equal(res.path, "/room/test_room_id/leave");
        equal(res.method, "POST");
      });
  });
});
