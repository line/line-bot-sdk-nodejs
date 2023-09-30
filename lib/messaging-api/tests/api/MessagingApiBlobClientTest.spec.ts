import { MessagingApiBlobClient } from "../../api";

import { GetMessageContentTranscodingResponse } from "../../model/getMessageContentTranscodingResponse";

import * as nock from "nock";
import { deepEqual, equal } from "assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("MessagingApiBlobClient", () => {
  before(() => nock.disableNetConnect());
  afterEach(() => nock.cleanAll());
  after(() => nock.enableNetConnect());

  const client = new MessagingApiBlobClient({
    channelAccessToken: channel_access_token,
  });

  it("getMessageContent", async () => {
    const scope = nock("https://api-data.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/message/{messageId}/content".replace("{messageId}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.getMessageContent(
      // messageId: string
      "DUMMY", // messageId(string)
    );
    equal(scope.isDone(), true);
  });

  it("getMessageContentPreview", async () => {
    const scope = nock("https://api-data.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/message/{messageId}/content/preview".replace(
            "{messageId}",
            "DUMMY",
          ), // string
        ),
      )
      .reply(200, {});

    const res = await client.getMessageContentPreview(
      // messageId: string
      "DUMMY", // messageId(string)
    );
    equal(scope.isDone(), true);
  });

  it("getMessageContentTranscodingByMessageId", async () => {
    const scope = nock("https://api-data.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/message/{messageId}/content/transcoding".replace(
            "{messageId}",
            "DUMMY",
          ), // string
        ),
      )
      .reply(200, {});

    const res = await client.getMessageContentTranscodingByMessageId(
      // messageId: string
      "DUMMY", // messageId(string)
    );
    equal(scope.isDone(), true);
  });

  it("getRichMenuImage", async () => {
    const scope = nock("https://api-data.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/richmenu/{richMenuId}/content".replace(
            "{richMenuId}",
            "DUMMY",
          ), // string
        ),
      )
      .reply(200, {});

    const res = await client.getRichMenuImage(
      // richMenuId: string
      "DUMMY", // richMenuId(string)
    );
    equal(scope.isDone(), true);
  });

  it("setRichMenuImage", async () => {
    const scope = nock("https://api-data.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u =>
        u.includes(
          "/v2/bot/richmenu/{richMenuId}/content".replace(
            "{richMenuId}",
            "DUMMY",
          ), // string
        ),
      )
      .reply(200, {});

    const res = await client.setRichMenuImage(
      // richMenuId: string
      "DUMMY", // richMenuId(string)
      // body: Blob
      new Blob([]), // paramName=body
    );
    equal(scope.isDone(), true);
  });
});
