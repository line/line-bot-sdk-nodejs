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
      equal(res.headers.authorization, "Bearer test_channel_access_token");
      equal(res.path, "/message/reply");
      equal(res.method, "POST");
      equal(res.body.replyToken, "test_reply_token");
      deepEqual(res.body.messages, [testMsg]);
    });
  });

  it("push", () => {
    return client.pushMessage("test_user_id", testMsg).then((res: any) => {
      equal(res.headers.authorization, "Bearer test_channel_access_token");
      equal(res.path, "/message/push");
      equal(res.method, "POST");
      equal(res.body.to, "test_user_id");
      deepEqual(res.body.messages, [testMsg]);
    });
  });

  it("multicast", () => {
    const ids = ["test_user_id_1", "test_user_id_2", "test_user_id_3"];
    return client.multicast(ids, [testMsg, testMsg]).then((res: any) => {
      equal(res.headers.authorization, "Bearer test_channel_access_token");
      equal(res.path, "/message/multicast");
      equal(res.method, "POST");
      deepEqual(res.body.to, [
        "test_user_id_1",
        "test_user_id_2",
        "test_user_id_3",
      ]);
      deepEqual(res.body.messages, [testMsg, testMsg]);
    });
  });

  it("getProfile", () => {
    return client.getProfile("test_user_id").then((res: any) => {
      equal(res.headers.authorization, "Bearer test_channel_access_token");
      equal(res.path, "/profile/test_user_id");
      equal(res.method, "GET");
    });
  });

  it("getGroupMemberProfile", () => {
    return client
      .getGroupMemberProfile("test_group_id", "test_user_id")
      .then((res: any) => {
        equal(res.headers.authorization, "Bearer test_channel_access_token");
        equal(res.path, "/group/test_group_id/member/test_user_id");
        equal(res.method, "GET");
      });
  });

  it("getRoomMemberProfile", () => {
    return client
      .getRoomMemberProfile("test_room_id", "test_user_id")
      .then((res: any) => {
        equal(res.headers.authorization, "Bearer test_channel_access_token");
        equal(res.path, "/room/test_room_id/member/test_user_id");
        equal(res.method, "GET");
      });
  });

  it("getGroupMemberIds", () => {
    return client
      .getGroupMemberIds("test_group_id")
      .then((ids: string[]) =>
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
        ]),
      );
  });

  it("getRoomMemberIds", () => {
    return client
      .getRoomMemberIds("test_room_id")
      .then((ids: string[]) =>
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
        ]),
      );
  });

  it("getMessageContent", () => {
    return client
      .getMessageContent("test_message_id")
      .then((s: Readable) => getStreamData(s))
      .then((data: string) => {
        const res = JSON.parse(data);
        equal(res.headers.authorization, "Bearer test_channel_access_token");
        equal(res.path, "/message/test_message_id/content");
        equal(res.method, "GET");
      });
  });

  it("leaveGroup", () => {
    return client.leaveGroup("test_group_id").then((res: any) => {
      equal(res.headers.authorization, "Bearer test_channel_access_token");
      equal(res.path, "/group/test_group_id/leave");
      equal(res.method, "POST");
    });
  });

  it("leaveRoom", () => {
    return client.leaveRoom("test_room_id").then((res: any) => {
      equal(res.headers.authorization, "Bearer test_channel_access_token");
      equal(res.path, "/room/test_room_id/leave");
      equal(res.method, "POST");
    });
  });

  it("getRichMenu", () => {
    return client.getRichMenu("test_rich_menu_id").then((res: any) => {
      equal(res.headers.authorization, "Bearer test_channel_access_token");
      equal(res.path, "/richmenu/test_rich_menu_id");
      equal(res.method, "GET");
    });
  });

  it("createRichMenu", () => {
    return client.createRichMenu(richMenu).then((res: any) => {
      equal(res.headers.authorization, "Bearer test_channel_access_token");
      equal(res.path, "/richmenu");
      equal(res.method, "POST");
      deepEqual(res.body, richMenu);
    });
  });

  it("deleteRichMenu", () => {
    return client.deleteRichMenu("test_rich_menu_id").then((res: any) => {
      equal(res.headers.authorization, "Bearer test_channel_access_token");
      equal(res.path, "/richmenu/test_rich_menu_id");
      equal(res.method, "DELETE");
    });
  });

  it("getRichMenuIdOfUser", () => {
    return client.getRichMenuIdOfUser("test_user_id").then((res: any) => {
      equal(res.headers.authorization, "Bearer test_channel_access_token");
      equal(res.path, "/user/test_user_id/richmenu");
      equal(res.method, "GET");
    });
  });

  it("linkRichMenuToUser", () => {
    return client
      .linkRichMenuToUser("test_user_id", "test_rich_menu_id")
      .then((res: any) => {
        equal(res.headers.authorization, "Bearer test_channel_access_token");
        equal(res.path, "/user/test_user_id/richmenu/test_rich_menu_id");
        equal(res.method, "POST");
      });
  });

  it("unlinkRichMenuFromUser", () => {
    return client
      .unlinkRichMenuFromUser("test_user_id", "test_rich_menu_id")
      .then((res: any) => {
        equal(res.headers.authorization, "Bearer test_channel_access_token");
        equal(res.path, "/user/test_user_id/richmenu/test_rich_menu_id");
        equal(res.method, "DELETE");
      });
  });

  it("setRichMenuImage", () => {
    const filepath = join(__dirname, "/helpers/line-icon.png");
    const buffer = readFileSync(filepath);
    return client
      .setRichMenuImage("test_rich_menu_id", buffer)
      .then((res: any) => {
        equal(res.headers.authorization, "Bearer test_channel_access_token");
        equal(res.path, "/richmenu/test_rich_menu_id/content");
        equal(res.method, "POST");
      });
  });

  it("getRichMenuImage", () => {
    return client
      .getRichMenuImage("test_rich_menu_id")
      .then((s: Readable) => getStreamData(s))
      .then((data: string) => {
        const res = JSON.parse(data);
        equal(res.headers.authorization, "Bearer test_channel_access_token");
        equal(res.path, "/richmenu/test_rich_menu_id/content");
        equal(res.method, "GET");
      });
  });

  it("getRichMenuList", () => {
    return client.getRichMenuList().then((res: any) => {
      equal(res.headers.authorization, "Bearer test_channel_access_token");
      equal(res.path, "/richmenu/list");
      equal(res.method, "GET");
    });
  });
});
