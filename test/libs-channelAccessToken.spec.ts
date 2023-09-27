import { channelAccessToken } from "../lib";
import * as nock from "nock";
import { deepEqual, equal } from "assert";

const pkg = require("../package.json");

const client = new channelAccessToken.ChannelAccessTokenClient({
  channelAccessToken: "test_channel_access_token",
});

describe("channelAccessToken", () => {
  before(() => nock.disableNetConnect());
  afterEach(() => nock.cleanAll());
  after(() => nock.enableNetConnect());

  it("issueStatelessChannelToken", async () => {
    const scope = nock("https://api.line.me/", {
      reqheaders: {
        Authorization: "Bearer test_channel_access_token",
        "User-Agent": `${pkg.name}/${pkg.version}`,
        "content-type": "application/x-www-form-urlencoded",
      },
    })
      .post(
        "/oauth2/v3/token",
        "grantType=test_client_id&clientAssertionType=test_client_secret&clientAssertion=test_grant_type&clientId=test_redirect_uri&clientSecret=test_code",
      )
      .reply(200, {});

    const res = await client.issueStatelessChannelToken(
      "test_client_id",
      "test_client_secret",
      "test_grant_type",
      "test_redirect_uri",
      "test_code",
    );
    equal(scope.isDone(), true);
    deepEqual(res, {});
  });
});
