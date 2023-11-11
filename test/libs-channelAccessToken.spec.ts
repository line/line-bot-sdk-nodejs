import { channelAccessToken } from "../lib";
import { deepEqual, equal } from "assert";
import { TestServer } from "./helpers/server";

const pkg = require("../package.json");

describe("channelAccessToken", () => {
  const server = new TestServer();
  beforeEach(async () => {
    server.reset();
    await server.listen();
  });
  afterEach(async () => {
    await server.close();
  });

  it("issueStatelessChannelToken", async () => {
    server.setHandler((req, res) => {
      equal(req.url, "/oauth2/v3/token");

      equal(req.headers["authorization"], `Bearer test_channel_access_token`);
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);
      equal(req.headers["content-type"], "application/x-www-form-urlencoded");

      let body = "";
      req.on("data", chunk => {
        body += chunk;
      });

      req.on("end", () => {
        equal(
          body,
          "grantType=test_client_id&clientAssertionType=test_client_secret&clientAssertion=test_grant_type&clientId=test_redirect_uri&clientSecret=test_code",
        );

        res.writeHead(200, { "Content-type": "application/json" });
        res.end(JSON.stringify({}));
      });
    });

    const client = new channelAccessToken.ChannelAccessTokenClient({
      channelAccessToken: "test_channel_access_token",
      baseURL: server.getUrl(),
    });

    const res = await client.issueStatelessChannelToken(
      "test_client_id",
      "test_client_secret",
      "test_grant_type",
      "test_redirect_uri",
      "test_code",
    );
    deepEqual(res, {});
    equal(server.getRequestCount(), 1);
  }).timeout(6000);
});
