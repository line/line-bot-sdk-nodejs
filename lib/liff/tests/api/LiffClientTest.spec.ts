import { LiffClient } from "../../api";

import { AddLiffAppRequest } from "../../model/addLiffAppRequest";
import { AddLiffAppResponse } from "../../model/addLiffAppResponse";
import { GetAllLiffAppsResponse } from "../../model/getAllLiffAppsResponse";
import { UpdateLiffAppRequest } from "../../model/updateLiffAppRequest";

import * as nock from "nock";
import { deepEqual, equal } from "assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("LiffClient", () => {
  before(() => nock.disableNetConnect());
  afterEach(() => nock.cleanAll());
  after(() => nock.enableNetConnect());

  const client = new LiffClient({
    channelAccessToken: channel_access_token,
  });

  it("addLIFFApp", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u => u.includes("/liff/v1/apps"))
      .reply(200, {});

    const res = await client.addLIFFApp(
      // addLiffAppRequest: AddLiffAppRequest
      {} as unknown as AddLiffAppRequest, // paramName=addLiffAppRequest
    );
    equal(scope.isDone(), true);
  });

  it("deleteLIFFApp", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .delete(u =>
        u.includes(
          "/liff/v1/apps/{liffId}".replace("{liffId}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.deleteLIFFApp(
      // liffId: string
      "DUMMY", // liffId(string)
    );
    equal(scope.isDone(), true);
  });

  it("getAllLIFFApps", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u => u.includes("/liff/v1/apps"))
      .reply(200, {});

    const res = await client.getAllLIFFApps();
    equal(scope.isDone(), true);
  });

  it("updateLIFFApp", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .put(u =>
        u.includes(
          "/liff/v1/apps/{liffId}".replace("{liffId}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.updateLIFFApp(
      // liffId: string
      "DUMMY", // liffId(string)
      // updateLiffAppRequest: UpdateLiffAppRequest
      {} as unknown as UpdateLiffAppRequest, // paramName=updateLiffAppRequest
    );
    equal(scope.isDone(), true);
  });
});
