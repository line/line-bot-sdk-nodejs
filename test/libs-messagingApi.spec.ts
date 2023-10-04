import { messagingApi } from "../lib";
import * as nock from "nock";
import { deepEqual, equal } from "assert";

const pkg = require("../package.json");

const channelAccessToken = "test_channel_access_token";

const client = new messagingApi.MessagingApiClient({
  channelAccessToken,
});

const blobClient = new messagingApi.MessagingApiBlobClient({
  channelAccessToken,
});

describe("messagingApi", () => {
  before(() => nock.disableNetConnect());
  afterEach(() => nock.cleanAll());
  after(() => nock.enableNetConnect());

  it("setRichMenuImage", async () => {
    const scope = nock("https://api-data.line.me/", {
      reqheaders: {
        Authorization: "Bearer test_channel_access_token",
        "User-Agent": `${pkg.name}/${pkg.version}`,
        "content-type": "image/jpeg",
      },
    })
      .post("/v2/bot/richmenu/aaaaaa/content", "GREAT_JPEG")
      .reply(200, {});

    const res = await blobClient.setRichMenuImage(
      "aaaaaa",
      new Blob(["GREAT_JPEG"], { type: "image/jpeg" }),
    );
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });

  it("pushMessage", async () => {
    const scope = nock("https://api.line.me/", {
      reqheaders: {
        Authorization: "Bearer test_channel_access_token",
        "User-Agent": `${pkg.name}/${pkg.version}`,
        "content-type": "application/json",
        "x-line-retry-key": "KEYKEYKEYKEY",
      },
    })
      .post("/v2/bot/message/push")
      .reply(200, {});

    const res = await client.pushMessage(
      { to: "uAAAAAAAAAAAAAA", messages: [{ type: "text", text: "aaaaaa" }] },
      "KEYKEYKEYKEY",
    );
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });
});
