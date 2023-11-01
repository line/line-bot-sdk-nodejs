import { channelAccessToken } from "../lib";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal } from "assert";

const pkg = require("../package.json");

const client = new channelAccessToken.ChannelAccessTokenClient({
  channelAccessToken: "test_channel_access_token",
});

describe("channelAccessToken", () => {
  it("issueStatelessChannelToken", async () => {
    const server = setupServer(
      http.post(
        "https://api.line.me/oauth2/v3/token",
        async ({ request, params, cookies }) => {
          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          equal(
            request.headers.get("User-Agent"),
            `${pkg.name}/${pkg.version}`,
          );
          equal(
            request.headers.get("content-type"),
            "application/x-www-form-urlencoded",
          );
          equal(await request.text(), "grantType=test_client_id&clientAssertionType=test_client_secret&clientAssertion=test_grant_type&clientId=test_redirect_uri&clientSecret=test_code");

          return HttpResponse.json({});
        },
      ),
    );
    server.listen();

    const res = await client.issueStatelessChannelToken(
      "test_client_id",
      "test_client_secret",
      "test_grant_type",
      "test_redirect_uri",
      "test_code",
    );
    deepEqual(res, {});
    server.close();
  });
});
