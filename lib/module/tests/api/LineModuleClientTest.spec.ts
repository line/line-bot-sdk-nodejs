import { LineModuleClient } from "../../api";

import { AcquireChatControlRequest } from "../../model/acquireChatControlRequest";
import { DetachModuleRequest } from "../../model/detachModuleRequest";
import { GetModulesResponse } from "../../model/getModulesResponse";

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal } from "assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("LineModuleClient", () => {
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

  const client = new LineModuleClient({
    channelAccessToken: channel_access_token,
  });

  it("acquireChatControl", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/chat/{chatId}/control/acquire".replace(
        "{chatId}",
        "DUMMY",
      ); // string

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

    const res = await client.acquireChatControl(
      // chatId: string
      "DUMMY", // chatId(string)
      // acquireChatControlRequest: AcquireChatControlRequest
      {} as unknown as AcquireChatControlRequest, // paramName=acquireChatControlRequest
    );

    equal(requestCount, 1);
  });

  it("detachModule", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/channel/detach";

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

    const res = await client.detachModule(
      // detachModuleRequest: DetachModuleRequest
      {} as unknown as DetachModuleRequest, // paramName=detachModuleRequest
    );

    equal(requestCount, 1);
  });

  it("getModules", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/list"
      .replace("{start}", "DUMMY") // string
      .replace("{limit}", "0"); // number

    server.use(
      http.get(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(
          request.headers.get("Authorization"),
          `Bearer ${channel_access_token}`,
        );
        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );

    const res = await client.getModules(
      // start: string
      "DUMMY" as unknown as string, // paramName=start(enum)
      // limit: number
      "DUMMY" as unknown as number, // paramName=limit(enum)
    );

    equal(requestCount, 1);
  });

  it("releaseChatControl", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/chat/{chatId}/control/release".replace(
        "{chatId}",
        "DUMMY",
      ); // string

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

    const res = await client.releaseChatControl(
      // chatId: string
      "DUMMY", // chatId(string)
    );

    equal(requestCount, 1);
  });
});
