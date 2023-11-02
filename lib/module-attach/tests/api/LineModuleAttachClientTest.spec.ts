import { LineModuleAttachClient } from "../../api";

import { AttachModuleResponse } from "../../model/attachModuleResponse";

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal } from "assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("LineModuleAttachClient", () => {
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

  const client = new LineModuleAttachClient({
    channelAccessToken: channel_access_token,
  });

  it("attachModule", async () => {
    let requestCount = 0;

    const endpoint = "https://manager.line.biz/module/auth/v1/token"
      .replace("{grantType}", "DUMMY") // string
      .replace("{code}", "DUMMY") // string
      .replace("{redirectUri}", "DUMMY") // string
      .replace("{codeVerifier}", "DUMMY") // string
      .replace("{clientId}", "DUMMY") // string
      .replace("{clientSecret}", "DUMMY") // string
      .replace("{region}", "DUMMY") // string
      .replace("{basicSearchId}", "DUMMY") // string
      .replace("{scope}", "DUMMY") // string
      .replace("{brandType}", "DUMMY"); // string

    server.use(
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

    equal(requestCount, 1);
  });
});
