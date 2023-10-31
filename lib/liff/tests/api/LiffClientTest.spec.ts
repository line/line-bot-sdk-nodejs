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
  const client = new LiffClient({
    channelAccessToken: channel_access_token,
  });

  it("addLIFFApp", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/liff/v1/apps";

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

    const res = await client.addLIFFApp(
      // addLiffAppRequest: AddLiffAppRequest
      {} as unknown as AddLiffAppRequest, // paramName=addLiffAppRequest
    );

    equal(requestCount, 1);

    server.close();
  });

  it("deleteLIFFApp", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/liff/v1/apps/{liffId}".replace(
      "{liffId}",
      "DUMMY",
    ); // string

    const server = setupServer(
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
    server.listen();

    const res = await client.deleteLIFFApp(
      // liffId: string
      "DUMMY", // liffId(string)
    );

    equal(requestCount, 1);

    server.close();
  });

  it("getAllLIFFApps", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/liff/v1/apps";

    const server = setupServer(
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
    server.listen();

    const res = await client.getAllLIFFApps();

    equal(requestCount, 1);

    server.close();
  });

  it("updateLIFFApp", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/liff/v1/apps/{liffId}".replace(
      "{liffId}",
      "DUMMY",
    ); // string

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

    const res = await client.updateLIFFApp(
      // liffId: string
      "DUMMY", // liffId(string)
      // updateLiffAppRequest: UpdateLiffAppRequest
      {} as unknown as UpdateLiffAppRequest, // paramName=updateLiffAppRequest
    );

    equal(requestCount, 1);

    server.close();
  });
});
