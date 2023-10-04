import { LineModuleClient } from "../../api";

import { AcquireChatControlRequest } from "../../model/acquireChatControlRequest";
import { DetachModuleRequest } from "../../model/detachModuleRequest";
import { GetModulesResponse } from "../../model/getModulesResponse";

import * as nock from "nock";
import { deepEqual, equal } from "assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("LineModuleClient", () => {
  before(() => nock.disableNetConnect());
  afterEach(() => nock.cleanAll());
  after(() => nock.enableNetConnect());

  const client = new LineModuleClient({
    channelAccessToken: channel_access_token,
  });

  it("acquireChatControl", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u =>
        u.includes(
          "/v2/bot/chat/{chatId}/control/acquire".replace("{chatId}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.acquireChatControl(
      // chatId: string
      "DUMMY", // chatId(string)
      // acquireChatControlRequest: AcquireChatControlRequest
      {} as unknown as AcquireChatControlRequest, // paramName=acquireChatControlRequest
    );
    equal(scope.isDone(), true);
  });

  it("detachModule", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u => u.includes("/v2/bot/channel/detach"))
      .reply(200, {});

    const res = await client.detachModule(
      // detachModuleRequest: DetachModuleRequest
      {} as unknown as DetachModuleRequest, // paramName=detachModuleRequest
    );
    equal(scope.isDone(), true);
  });

  it("getModules", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/list"
            .replace("{start}", "DUMMY") // string

            .replace("{limit}", "0"), // number
        ),
      )
      .reply(200, {});

    const res = await client.getModules(
      // start: string
      "DUMMY" as unknown as string, // paramName=start(enum)
      // limit: number
      "DUMMY" as unknown as number, // paramName=limit(enum)
    );
    equal(scope.isDone(), true);
  });

  it("releaseChatControl", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u =>
        u.includes(
          "/v2/bot/chat/{chatId}/control/release".replace("{chatId}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.releaseChatControl(
      // chatId: string
      "DUMMY", // chatId(string)
    );
    equal(scope.isDone(), true);
  });
});
