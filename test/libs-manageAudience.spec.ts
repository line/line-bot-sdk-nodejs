import { manageAudience } from "../lib";
import { deepEqual, equal, match } from "assert";
import { TestServer } from "./helpers/server";

const pkg = require("../package.json");

const channelAccessToken = "test_channel_access_token";

describe("manageAudience", () => {
  const server = new TestServer();
  beforeEach(async () => {
    server.reset();
    await server.listen();
  });
  afterEach(async () => {
    await server.close();
  });

  it("createAudienceForUploadingUserIds", async () => {
    server.setHandler((req, res) => {
      equal(req.url, "/v2/bot/audienceGroup/upload/byFile");

      equal(req.headers["authorization"], `Bearer test_channel_access_token`);
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);
      match(req.headers["content-type"], /^multipart\/form-data; boundary=.*$/);

      res.writeHead(200, { "Content-type": "application/json" });
      res.end("{}");
    });

    const blobClient = new manageAudience.ManageAudienceBlobClient({
      channelAccessToken,
      baseURL: server.getUrl(),
    });

    const res = await blobClient.createAudienceForUploadingUserIds(
      new Blob(["c9161b19-57f8-46c2-a71f-dfa87314dabe"], {
        type: "text/plain",
      }),
      "test_description",
      true,
    );
    equal(server.getRequestCount(), 1);
    deepEqual(res, {});
  }).timeout(6000);
});
