import { manageAudience } from "../lib";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal, match } from "node:assert";

const pkg = require("../package.json");

const channelAccessToken = "test_channel_access_token";

const client = new manageAudience.ManageAudienceClient({
  channelAccessToken,
});

const blobClient = new manageAudience.ManageAudienceBlobClient({
  channelAccessToken,
});

describe("manageAudience", () => {
  const server = setupServer();
  before(() => {
    server.listen();
  });
  after(() => {
    server.close();
  });
  afterEach(() => {
    server.resetHandlers();
  });

  it("createAudienceForUploadingUserIds", async () => {
    let requestCount = 0;
    server.use(
      http.post(
        "https://api-data.line.me/v2/bot/audienceGroup/upload/byFile",
        ({ request }) => {
          requestCount++;

          equal(
            request.headers.get("Authorization"),
            `Bearer test_channel_access_token`,
          );
          equal(
            request.headers.get("User-Agent"),
            `${pkg.name}/${pkg.version}`,
          );
          match(
            request.headers.get("content-type")!!,
            /^multipart\/form-data; boundary=.*$/,
          );

          return HttpResponse.json({});
        },
      ),
    );

    const res = await blobClient.createAudienceForUploadingUserIds(
      new Blob(["c9161b19-57f8-46c2-a71f-dfa87314dabe"], {
        type: "text/plain",
      }),
      "test_description",
      true,
    );
    equal(requestCount, 1);
    deepEqual(res, {});
  });
});
