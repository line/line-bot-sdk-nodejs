import { channelAccessToken } from "../lib";
import { createServer } from "http";
import { deepEqual, equal, match, ok } from "assert";

const pkg = require("../package.json");

describe("channelAccessToken", () => {
  it("issueStatelessChannelToken", async () => {
    let requestCount = 0;
    const server = createServer((req, res) => {
      requestCount++;
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
    await new Promise(resolve => {
      server.listen(0);
      server.on("listening", resolve);
    });

    const serverAddress = server.address();
    if (typeof serverAddress === "string" || serverAddress === null) {
      throw new Error("Unexpected server address: " + serverAddress);
    }

    const client = new channelAccessToken.ChannelAccessTokenClient({
      channelAccessToken: "test_channel_access_token",
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.issueStatelessChannelToken(
      "test_client_id",
      "test_client_secret",
      "test_grant_type",
      "test_redirect_uri",
      "test_code",
    );
    deepEqual(res, {});
    equal(requestCount, 1);
    server.close();
  });
});
