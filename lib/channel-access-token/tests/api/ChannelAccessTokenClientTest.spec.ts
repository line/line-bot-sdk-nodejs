import { ChannelAccessTokenClient } from "../../api";

import { ChannelAccessTokenKeyIdsResponse } from "../../model/channelAccessTokenKeyIdsResponse";
import { ErrorResponse } from "../../model/errorResponse";
import { IssueChannelAccessTokenResponse } from "../../model/issueChannelAccessTokenResponse";
import { IssueShortLivedChannelAccessTokenResponse } from "../../model/issueShortLivedChannelAccessTokenResponse";
import { IssueStatelessChannelAccessTokenResponse } from "../../model/issueStatelessChannelAccessTokenResponse";
import { VerifyChannelAccessTokenResponse } from "../../model/verifyChannelAccessTokenResponse";

import * as nock from "nock";
import { deepEqual, equal } from "assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("ChannelAccessTokenClient", () => {
  before(() => nock.disableNetConnect());
  afterEach(() => nock.cleanAll());
  after(() => nock.enableNetConnect());

  const client = new ChannelAccessTokenClient({
    channelAccessToken: channel_access_token,
  });

  it("getsAllValidChannelAccessTokenKeyIds", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/oauth2/v2.1/tokens/kid"
            .replace("{clientAssertionType}", "DUMMY") // string

            .replace("{clientAssertion}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.getsAllValidChannelAccessTokenKeyIds(
      // clientAssertionType: string
      "DUMMY" as unknown as string, // paramName=clientAssertionType(enum)
      // clientAssertion: string
      "DUMMY" as unknown as string, // paramName=clientAssertion(enum)
    );
    equal(scope.isDone(), true);
  });

  it("issueChannelToken", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u =>
        u.includes(
          "/v2/oauth/accessToken"
            .replace("{grantType}", "DUMMY") // string

            .replace("{clientId}", "DUMMY") // string

            .replace("{clientSecret}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.issueChannelToken(
      // grantType: string
      "DUMMY", // grantType(string)
      // clientId: string
      "DUMMY", // clientId(string)
      // clientSecret: string
      "DUMMY", // clientSecret(string)
    );
    equal(scope.isDone(), true);
  });

  it("issueChannelTokenByJWT", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u =>
        u.includes(
          "/oauth2/v2.1/token"
            .replace("{grantType}", "DUMMY") // string

            .replace("{clientAssertionType}", "DUMMY") // string

            .replace("{clientAssertion}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.issueChannelTokenByJWT(
      // grantType: string
      "DUMMY", // grantType(string)
      // clientAssertionType: string
      "DUMMY", // clientAssertionType(string)
      // clientAssertion: string
      "DUMMY", // clientAssertion(string)
    );
    equal(scope.isDone(), true);
  });

  it("issueStatelessChannelToken", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u =>
        u.includes(
          "/oauth2/v3/token"
            .replace("{grantType}", "DUMMY") // string

            .replace("{clientAssertionType}", "DUMMY") // string

            .replace("{clientAssertion}", "DUMMY") // string

            .replace("{clientId}", "DUMMY") // string

            .replace("{clientSecret}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.issueStatelessChannelToken(
      // grantType: string
      "DUMMY" as unknown as string, // paramName=grantType(enum)
      // clientAssertionType: string
      "DUMMY" as unknown as string, // paramName=clientAssertionType(enum)
      // clientAssertion: string
      "DUMMY", // clientAssertion(string)
      // clientId: string
      "DUMMY", // clientId(string)
      // clientSecret: string
      "DUMMY", // clientSecret(string)
    );
    equal(scope.isDone(), true);
  });

  it("revokeChannelToken", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u =>
        u.includes(
          "/v2/oauth/revoke".replace("{accessToken}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.revokeChannelToken(
      // accessToken: string
      "DUMMY", // accessToken(string)
    );
    equal(scope.isDone(), true);
  });

  it("revokeChannelTokenByJWT", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u =>
        u.includes(
          "/oauth2/v2.1/revoke"
            .replace("{clientId}", "DUMMY") // string

            .replace("{clientSecret}", "DUMMY") // string

            .replace("{accessToken}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.revokeChannelTokenByJWT(
      // clientId: string
      "DUMMY", // clientId(string)
      // clientSecret: string
      "DUMMY", // clientSecret(string)
      // accessToken: string
      "DUMMY", // accessToken(string)
    );
    equal(scope.isDone(), true);
  });

  it("verifyChannelToken", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u =>
        u.includes(
          "/v2/oauth/verify".replace("{accessToken}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.verifyChannelToken(
      // accessToken: string
      "DUMMY", // accessToken(string)
    );
    equal(scope.isDone(), true);
  });

  it("verifyChannelTokenByJWT", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/oauth2/v2.1/verify".replace("{accessToken}", "DUMMY"), // string
        ),
      )
      .reply(200, {});

    const res = await client.verifyChannelTokenByJWT(
      // accessToken: string
      "DUMMY" as unknown as string, // paramName=accessToken(enum)
    );
    equal(scope.isDone(), true);
  });
});
