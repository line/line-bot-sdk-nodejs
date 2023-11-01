import { LiffClient } from "../../api";

import { AddLiffAppRequest } from "../../model/addLiffAppRequest";
import { AddLiffAppResponse } from "../../model/addLiffAppResponse";
import { GetAllLiffAppsResponse } from "../../model/getAllLiffAppsResponse";
import { UpdateLiffAppRequest } from "../../model/updateLiffAppRequest";

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal } from "assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("LiffClient", () => {
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

  const client = new LiffClient({
    channelAccessToken: channel_access_token,
  });

  it("addLIFFApp", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/liff/v1/apps";

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

    const res = await client.addLIFFApp(
      // addLiffAppRequest: AddLiffAppRequest
      {} as unknown as AddLiffAppRequest, // paramName=addLiffAppRequest
    );

    equal(requestCount, 1);
  });

  it("deleteLIFFApp", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/liff/v1/apps/{liffId}".replace(
      "{liffId}",
      "DUMMY",
    ); // string

    server.use(
      http.delete(endpoint, ({ request, params, cookies }) => {
        requestCount++;

        equal(
          request.headers.get("Authorization"),
          `Bearer ${channel_access_token}`,
        );
        equal(request.headers.get("User-Agent"), `${pkg.name}/${pkg.version}`);

        return HttpResponse.json({});
      }),
    );

    const res = await client.deleteLIFFApp(
      // liffId: string
      "DUMMY", // liffId(string)
    );

    equal(requestCount, 1);
  });

  it("getAllLIFFApps", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/liff/v1/apps";

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

    const res = await client.getAllLIFFApps();

    equal(requestCount, 1);
  });

  it("updateLIFFApp", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/liff/v1/apps/{liffId}".replace(
      "{liffId}",
      "DUMMY",
    ); // string

    server.use(
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

    const res = await client.updateLIFFApp(
      // liffId: string
      "DUMMY", // liffId(string)
      // updateLiffAppRequest: UpdateLiffAppRequest
      {} as unknown as UpdateLiffAppRequest, // paramName=updateLiffAppRequest
    );

    equal(requestCount, 1);
  });
});
