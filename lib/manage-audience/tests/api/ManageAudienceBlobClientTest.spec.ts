import { ManageAudienceBlobClient } from "../../api";

import { CreateAudienceGroupResponse } from "../../model/createAudienceGroupResponse";

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal } from "assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("ManageAudienceBlobClient", () => {
  const client = new ManageAudienceBlobClient({
    channelAccessToken: channel_access_token,
  });

  it("addUserIdsToAudience", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api-data.line.me/v2/bot/audienceGroup/upload/byFile"
        .replace("{audienceGroupId}", "0") // number
        .replace("{uploadDescription}", "DUMMY"); // string

    const server = setupServer(
      http.put(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(
          request.headers.get("Authorization"),
          `Bearer ${channel_access_token}`,
        );
        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );
    server.listen();

    const res = await client.addUserIdsToAudience(
      // file: Blob
      new Blob([]), // paramName=file
      // audienceGroupId: number
      0, // paramName=audienceGroupId(number or int or long)
      // uploadDescription: string
      "DUMMY", // uploadDescription(string)
    );

    equal(requestCount, 1);

    server.close();
  });

  it("createAudienceForUploadingUserIds", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api-data.line.me/v2/bot/audienceGroup/upload/byFile"
        .replace("{description}", "DUMMY") // string
        .replace("{uploadDescription}", "DUMMY"); // string

    const server = setupServer(
      http.post(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(
          request.headers.get("Authorization"),
          `Bearer ${channel_access_token}`,
        );
        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );
    server.listen();

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

    equal(requestCount, 1);

    server.close();
  });
});
