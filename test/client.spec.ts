import { readFileSync } from "fs";
import { join } from "path";
import { deepEqual, equal } from "assert";
import { Readable } from "stream";
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

  it("reply", () => {
    return client.replyMessage("test_reply_token", testMsg).then((res: any) => {
      const req = getRecentReq();
      equal(req.headers.authorization, "Bearer test_channel_access_token");
      equal(req.path, "/message/reply");
      equal(req.method, "POST");
      equal(req.body.replyToken, "test_reply_token");
      deepEqual(req.body.messages, [testMsg]);
      deepEqual(res, {});
    });
  });

  it("push", () => {
    return client.pushMessage("test_user_id", testMsg).then((res: any) => {
      const req = getRecentReq();
      equal(req.headers.authorization, "Bearer test_channel_access_token");
      equal(req.path, "/message/push");
      equal(req.method, "POST");
      equal(req.body.to, "test_user_id");
      deepEqual(req.body.messages, [testMsg]);
      deepEqual(res, {});
    });
  });

  it("multicast", () => {
    const ids = ["test_user_id_1", "test_user_id_2", "test_user_id_3"];
    return client.multicast(ids, [testMsg, testMsg]).then((res: any) => {
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
      deepEqual(res, {});
    });
  });

  it("getProfile", () => {
    return client.getProfile("test_user_id").then((res: any) => {
      const req = getRecentReq();
      equal(req.headers.authorization, "Bearer test_channel_access_token");
      equal(req.path, "/profile/test_user_id");
      equal(req.method, "GET");
      deepEqual(res, {});
    });
  });

  it("getGroupMemberProfile", () => {
    return client
      .getGroupMemberProfile("test_group_id", "test_user_id")
      .then((res: any) => {
        const req = getRecentReq();
        equal(req.headers.authorization, "Bearer test_channel_access_token");
        equal(req.path, "/group/test_group_id/member/test_user_id");
        equal(req.method, "GET");
        deepEqual(res, {});
      });
  });

  it("getRoomMemberProfile", () => {
    return client
      .getRoomMemberProfile("test_room_id", "test_user_id")
      .then((res: any) => {
        const req = getRecentReq();
        equal(req.headers.authorization, "Bearer test_channel_access_token");
        equal(req.path, "/room/test_room_id/member/test_user_id");
        equal(req.method, "GET");
        deepEqual(res, {});
      });
  });

  it("getGroupMemberIds", () => {
    return client.getGroupMemberIds("test_group_id").then((ids: string[]) => {
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
  });

  it("getRoomMemberIds", () => {
    return client.getRoomMemberIds("test_room_id").then((ids: string[]) => {
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
  });

  it("getMessageContent", () => {
    return client
      .getMessageContent("test_message_id")
      .then((s: Readable) => getStreamData(s))
      .then((data: string) => {
        const req = getRecentReq();
        equal(req.headers.authorization, "Bearer test_channel_access_token");
        equal(req.path, "/message/test_message_id/content");
        equal(req.method, "GET");

        const res = JSON.parse(data);
        deepEqual(res, {});
      });
  });

  it("leaveGroup", () => {
    return client.leaveGroup("test_group_id").then((res: any) => {
      const req = getRecentReq();
      equal(req.headers.authorization, "Bearer test_channel_access_token");
      equal(req.path, "/group/test_group_id/leave");
      equal(req.method, "POST");
      deepEqual(res, {});
    });
  });

  it("leaveRoom", () => {
    return client.leaveRoom("test_room_id").then((res: any) => {
      const req = getRecentReq();
      equal(req.headers.authorization, "Bearer test_channel_access_token");
      equal(req.path, "/room/test_room_id/leave");
      equal(req.method, "POST");
      deepEqual(res, {});
    });
  });

  it("getRichMenu", () => {
    return client.getRichMenu("test_rich_menu_id").then((res: any) => {
      const req = getRecentReq();
      equal(req.headers.authorization, "Bearer test_channel_access_token");
      equal(req.path, "/richmenu/test_rich_menu_id");
      equal(req.method, "GET");
      deepEqual(res, {});
    });
  });

  it("createRichMenu", () => {
    return client.createRichMenu(richMenu).then(() => {
      const req = getRecentReq();
      equal(req.headers.authorization, "Bearer test_channel_access_token");
      equal(req.path, "/richmenu");
      equal(req.method, "POST");
      deepEqual(req.body, richMenu);
    });
  });

  it("deleteRichMenu", () => {
    return client.deleteRichMenu("test_rich_menu_id").then((res: any) => {
      const req = getRecentReq();
      equal(req.headers.authorization, "Bearer test_channel_access_token");
      equal(req.path, "/richmenu/test_rich_menu_id");
      equal(req.method, "DELETE");
      deepEqual(res, {});
    });
  });

  it("getRichMenuIdOfUser", () => {
    return client.getRichMenuIdOfUser("test_user_id").then(() => {
      const req = getRecentReq();
      equal(req.headers.authorization, "Bearer test_channel_access_token");
      equal(req.path, "/user/test_user_id/richmenu");
      equal(req.method, "GET");
    });
  });

  it("linkRichMenuToUser", () => {
    return client
      .linkRichMenuToUser("test_user_id", "test_rich_menu_id")
      .then((res: any) => {
        const req = getRecentReq();
        equal(req.headers.authorization, "Bearer test_channel_access_token");
        equal(req.path, "/user/test_user_id/richmenu/test_rich_menu_id");
        equal(req.method, "POST");
        deepEqual(res, {});
      });
  });

  it("unlinkRichMenuFromUser", () => {
    return client.unlinkRichMenuFromUser("test_user_id").then((res: any) => {
      const req = getRecentReq();
      equal(req.headers.authorization, "Bearer test_channel_access_token");
      equal(req.path, "/user/test_user_id/richmenu");
      equal(req.method, "DELETE");
      deepEqual(res, {});
    });
  });

  it("linkRichMenuToMultipleUsers", () => {
    return client
      .linkRichMenuToMultipleUsers("test_rich_menu_id", ["test_user_id"])
      .then((res: any) => {
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
  });

  it("unlinkRichMenusFromMultipleUsers", () => {
    return client
      .unlinkRichMenusFromMultipleUsers(["test_user_id"])
      .then((res: any) => {
        const req = getRecentReq();
        equal(req.headers.authorization, "Bearer test_channel_access_token");
        equal(req.path, "/richmenu/bulk/unlink");
        equal(req.method, "POST");
        deepEqual(res, {});
        deepEqual(req.body, {
          userIds: ["test_user_id"],
        });
      });
  });

  it("setRichMenuImage", () => {
    const filepath = join(__dirname, "/helpers/line-icon.png");
    const buffer = readFileSync(filepath);
    return client
      .setRichMenuImage("test_rich_menu_id", buffer)
      .then((res: any) => {
        const req = getRecentReq();
        equal(req.headers.authorization, "Bearer test_channel_access_token");
        equal(req.path, "/richmenu/test_rich_menu_id/content");
        equal(req.method, "POST");
        deepEqual(res, {});
      });
  });

  it("getRichMenuImage", () => {
    return client
      .getRichMenuImage("test_rich_menu_id")
      .then((s: Readable) => getStreamData(s))
      .then((data: string) => {
        const req = getRecentReq();
        equal(req.headers.authorization, "Bearer test_channel_access_token");
        equal(req.path, "/richmenu/test_rich_menu_id/content");
        equal(req.method, "GET");

        const res = JSON.parse(data);
        deepEqual(res, {});
      });
  });

  it("getRichMenuList", () => {
    return client.getRichMenuList().then(() => {
      const req = getRecentReq();
      equal(req.headers.authorization, "Bearer test_channel_access_token");
      equal(req.path, "/richmenu/list");
      equal(req.method, "GET");
    });
  });

  it("setDefaultRichMenu", () => {
    return client.setDefaultRichMenu("test_rich_menu_id").then((res: any) => {
      const req = getRecentReq();
      equal(req.headers.authorization, "Bearer test_channel_access_token");
      equal(req.path, "/user/all/richmenu/test_rich_menu_id");
      equal(req.method, "POST");
      deepEqual(res, {});
    });
  });

  it("getDefaultRichMenuId", () => {
    return client.getDefaultRichMenuId().then(() => {
      const req = getRecentReq();
      equal(req.headers.authorization, "Bearer test_channel_access_token");
      equal(req.path, "/user/all/richmenu");
      equal(req.method, "GET");
    });
  });

  it("deleteDefaultRichMenu", () => {
    return client.deleteDefaultRichMenu().then((res: any) => {
      const req = getRecentReq();
      equal(req.headers.authorization, "Bearer test_channel_access_token");
      equal(req.path, "/user/all/richmenu");
      equal(req.method, "DELETE");
      deepEqual(res, {});
    });
  });

  it("getLinkToken", () => {
    return client.getLinkToken("test_user_id").then(() => {
      const req = getRecentReq();
      equal(req.headers.authorization, "Bearer test_channel_access_token");
      equal(req.path, "/user/test_user_id/linkToken");
      equal(req.method, "POST");
    });
  });

  it("getNumberOfSentReplyMessages", () => {
    const date = "20191231";
    return client.getNumberOfSentReplyMessages(date).then(() => {
      const req = getRecentReq();
      equal(req.headers.authorization, "Bearer test_channel_access_token");
      equal(req.path, "/message/delivery/reply");
      equal(req.query.date, date);
      equal(req.method, "GET");
    });
  });

  it("getNumberOfSentPushMessages", () => {
    const date = "20191231";
    return client.getNumberOfSentPushMessages(date).then(() => {
      const req = getRecentReq();
      equal(req.headers.authorization, "Bearer test_channel_access_token");
      equal(req.path, "/message/delivery/push");
      equal(req.query.date, date);
      equal(req.method, "GET");
    });
  });

  it("getNumberOfSentMulticastMessages", () => {
    const date = "20191231";
    return client.getNumberOfSentMulticastMessages(date).then(() => {
      const req = getRecentReq();
      equal(req.headers.authorization, "Bearer test_channel_access_token");
      equal(req.path, "/message/delivery/multicast");
      equal(req.query.date, date);
      equal(req.method, "GET");
    });
  });
});
