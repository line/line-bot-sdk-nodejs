import { LineModuleAttachClient } from "../../api";

import { AttachModuleResponse } from "../../model/attachModuleResponse";

import * as nock from "nock";
import { deepEqual, equal } from "assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("LineModuleAttachClient", () => {
  before(() => nock.disableNetConnect());
  afterEach(() => nock.cleanAll());
  after(() => nock.enableNetConnect());

  const client = new LineModuleAttachClient({
    channelAccessToken: channel_access_token,
  });

  it("attachModule", async () => {
    const scope = nock("https://manager.line.biz", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u =>
        u.includes(
          "/module/auth/v1/token"
            .replace("{grantType}", "DUMMY") // string

            .replace("{code}", "DUMMY") // string

            .replace("{redirectUri}", "DUMMY") // string

            .replace("{codeVerifier}", "DUMMY") // string

            .replace("{clientId}", "DUMMY") // string

            .replace("{clientSecret}", "DUMMY") // string

            .replace("{region}", "DUMMY") // string

            .replace("{basicSearchId}", "DUMMY") // string

            .replace("{scope}", "DUMMY") // string

            .replace("{brandType}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.attachModule(
      // grantType: string
      "DUMMY", // grantType(string)
      // code: string
      "DUMMY", // code(string)
      // redirectUri: string
      "DUMMY", // redirectUri(string)
      // codeVerifier: string
      "DUMMY", // codeVerifier(string)
      // clientId: string
      "DUMMY", // clientId(string)
      // clientSecret: string
      "DUMMY", // clientSecret(string)
      // region: string
      "DUMMY", // region(string)
      // basicSearchId: string
      "DUMMY", // basicSearchId(string)
      // scope: string
      "DUMMY", // scope(string)
      // brandType: string
      "DUMMY", // brandType(string)
    );
    equal(scope.isDone(), true);
  });
});
