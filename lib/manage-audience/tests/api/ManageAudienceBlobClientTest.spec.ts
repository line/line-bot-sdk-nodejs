import { ManageAudienceBlobClient } from "../../api";

import { CreateAudienceGroupResponse } from "../../model/createAudienceGroupResponse";

import * as nock from "nock";
import { deepEqual, equal } from "assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("ManageAudienceBlobClient", () => {
  before(() => nock.disableNetConnect());
  afterEach(() => nock.cleanAll());
  after(() => nock.enableNetConnect());

  const client = new ManageAudienceBlobClient({
    channelAccessToken: channel_access_token,
  });

  it("addUserIdsToAudience", async () => {
    const scope = nock("https://api-data.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .put(u =>
        u.includes(
          "/v2/bot/audienceGroup/upload/byFile"

            .replace("{audienceGroupId}", "0") // number

            .replace("{uploadDescription}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.addUserIdsToAudience(
      // file: Blob
      new Blob([]), // paramName=file
      // audienceGroupId: number
      0, // paramName=audienceGroupId(number or int or long)
      // uploadDescription: string
      "DUMMY", // uploadDescription(string)
    );
    equal(scope.isDone(), true);
  });

  it("createAudienceForUploadingUserIds", async () => {
    const scope = nock("https://api-data.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u =>
        u.includes(
          "/v2/bot/audienceGroup/upload/byFile"

            .replace("{description}", "DUMMY") // string

            .replace("{uploadDescription}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.createAudienceForUploadingUserIds(
      // file: Blob
      new Blob([]), // paramName=file
      // description: string
      "DUMMY", // description(string)
      // isIfaAudience: boolean
      true, // paramName=isIfaAudience
      // uploadDescription: string
      "DUMMY", // uploadDescription(string)
    );
    equal(scope.isDone(), true);
  });
});
