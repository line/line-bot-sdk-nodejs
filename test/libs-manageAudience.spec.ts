import { manageAudience } from "../lib";
import { createServer } from "http";
import { deepEqual, equal, match } from "assert";

const pkg = require("../package.json");

const channelAccessToken = "test_channel_access_token";

describe("manageAudience", () => {
  it("createAudienceForUploadingUserIds", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;
      equal(req.url, "/v2/bot/audienceGroup/upload/byFile");

      equal(req.headers["authorization"], `Bearer test_channel_access_token`);
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);
      match(req.headers["content-type"], /^multipart\/form-data; boundary=.*$/);

      res.writeHead(200, { "Content-type": "application/json" });
      res.end("{}");
    });
    await new Promise(resolve => {
      server.listen(0);
      server.on("listening", resolve);
    });

    const serverAddress = server.address();
    if (typeof serverAddress === "string" || serverAddress === null) {
      throw new Error("Unexpected server address: " + serverAddress);
    }

    const blobClient = new manageAudience.ManageAudienceBlobClient({
      channelAccessToken,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await blobClient.createAudienceForUploadingUserIds(
      new Blob(["c9161b19-57f8-46c2-a71f-dfa87314dabe"], {
        type: "text/plain",
      }),
      "test_description",
      true,
    );
    equal(requestCount, 1);
    deepEqual(res, {});
    server.close();
  });
});
