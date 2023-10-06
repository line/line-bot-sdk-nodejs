import { ManageAudienceClient } from "../../api";

import { AddAudienceToAudienceGroupRequest } from "../../model/addAudienceToAudienceGroupRequest";
import { AudienceGroupCreateRoute } from "../../model/audienceGroupCreateRoute";
import { AudienceGroupStatus } from "../../model/audienceGroupStatus";
import { CreateAudienceGroupRequest } from "../../model/createAudienceGroupRequest";
import { CreateAudienceGroupResponse } from "../../model/createAudienceGroupResponse";
import { CreateClickBasedAudienceGroupRequest } from "../../model/createClickBasedAudienceGroupRequest";
import { CreateClickBasedAudienceGroupResponse } from "../../model/createClickBasedAudienceGroupResponse";
import { CreateImpBasedAudienceGroupRequest } from "../../model/createImpBasedAudienceGroupRequest";
import { CreateImpBasedAudienceGroupResponse } from "../../model/createImpBasedAudienceGroupResponse";
import { ErrorResponse } from "../../model/errorResponse";
import { GetAudienceDataResponse } from "../../model/getAudienceDataResponse";
import { GetAudienceGroupAuthorityLevelResponse } from "../../model/getAudienceGroupAuthorityLevelResponse";
import { GetAudienceGroupsResponse } from "../../model/getAudienceGroupsResponse";
import { UpdateAudienceGroupAuthorityLevelRequest } from "../../model/updateAudienceGroupAuthorityLevelRequest";
import { UpdateAudienceGroupDescriptionRequest } from "../../model/updateAudienceGroupDescriptionRequest";

import * as nock from "nock";
import { deepEqual, equal } from "assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("ManageAudienceClient", () => {
  before(() => nock.disableNetConnect());
  afterEach(() => nock.cleanAll());
  after(() => nock.enableNetConnect());

  const client = new ManageAudienceClient({
    channelAccessToken: channel_access_token,
  });

  it("activateAudienceGroup", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .put(u =>
        u.includes(
          "/v2/bot/audienceGroup/{audienceGroupId}/activate".replace(
            "{audienceGroupId}",
            "0",
          ), // number
        ),
      )
      .reply(200, {});

    const res = await client.activateAudienceGroup(
      // audienceGroupId: number
      0, // paramName=audienceGroupId(number or int or long)
    );
    equal(scope.isDone(), true);
  });

  it("addAudienceToAudienceGroup", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .put(u => u.includes("/v2/bot/audienceGroup/upload"))
      .reply(200, {});

    const res = await client.addAudienceToAudienceGroup(
      // addAudienceToAudienceGroupRequest: AddAudienceToAudienceGroupRequest
      {} as unknown as AddAudienceToAudienceGroupRequest, // paramName=addAudienceToAudienceGroupRequest
    );
    equal(scope.isDone(), true);
  });

  it("createAudienceGroup", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u => u.includes("/v2/bot/audienceGroup/upload"))
      .reply(200, {});

    const res = await client.createAudienceGroup(
      // createAudienceGroupRequest: CreateAudienceGroupRequest
      {} as unknown as CreateAudienceGroupRequest, // paramName=createAudienceGroupRequest
    );
    equal(scope.isDone(), true);
  });

  it("createClickBasedAudienceGroup", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u => u.includes("/v2/bot/audienceGroup/click"))
      .reply(200, {});

    const res = await client.createClickBasedAudienceGroup(
      // createClickBasedAudienceGroupRequest: CreateClickBasedAudienceGroupRequest
      {} as unknown as CreateClickBasedAudienceGroupRequest, // paramName=createClickBasedAudienceGroupRequest
    );
    equal(scope.isDone(), true);
  });

  it("createImpBasedAudienceGroup", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .post(u => u.includes("/v2/bot/audienceGroup/imp"))
      .reply(200, {});

    const res = await client.createImpBasedAudienceGroup(
      // createImpBasedAudienceGroupRequest: CreateImpBasedAudienceGroupRequest
      {} as unknown as CreateImpBasedAudienceGroupRequest, // paramName=createImpBasedAudienceGroupRequest
    );
    equal(scope.isDone(), true);
  });

  it("deleteAudienceGroup", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .delete(u =>
        u.includes(
          "/v2/bot/audienceGroup/{audienceGroupId}".replace(
            "{audienceGroupId}",
            "0",
          ), // number
        ),
      )
      .reply(200, {});

    const res = await client.deleteAudienceGroup(
      // audienceGroupId: number
      0, // paramName=audienceGroupId(number or int or long)
    );
    equal(scope.isDone(), true);
  });

  it("getAudienceData", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/audienceGroup/{audienceGroupId}".replace(
            "{audienceGroupId}",
            "0",
          ), // number
        ),
      )
      .reply(200, {});

    const res = await client.getAudienceData(
      // audienceGroupId: number
      0, // paramName=audienceGroupId(number or int or long)
    );
    equal(scope.isDone(), true);
  });

  it("getAudienceGroupAuthorityLevel", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u => u.includes("/v2/bot/audienceGroup/authorityLevel"))
      .reply(200, {});

    const res = await client.getAudienceGroupAuthorityLevel();
    equal(scope.isDone(), true);
  });

  it("getAudienceGroups", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .get(u =>
        u.includes(
          "/v2/bot/audienceGroup/list"
            .replace("{page}", "0") // number

            .replace("{description}", "DUMMY") // string

            .replace("{size}", "0"), // number
        ),
      )
      .reply(200, {});

    const res = await client.getAudienceGroups(
      // page: number
      "DUMMY" as unknown as number, // paramName=page(enum)
      // description: string
      "DUMMY" as unknown as string, // paramName=description(enum)
      // status: AudienceGroupStatus
      "DUMMY" as unknown as AudienceGroupStatus, // paramName=status(enum)
      // size: number
      "DUMMY" as unknown as number, // paramName=size(enum)
      // includesExternalPublicGroups: boolean
      "DUMMY" as unknown as boolean, // paramName=includesExternalPublicGroups(enum)
      // createRoute: AudienceGroupCreateRoute
      "DUMMY" as unknown as AudienceGroupCreateRoute, // paramName=createRoute(enum)
    );
    equal(scope.isDone(), true);
  });

  it("updateAudienceGroupAuthorityLevel", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .put(u => u.includes("/v2/bot/audienceGroup/authorityLevel"))
      .reply(200, {});

    const res = await client.updateAudienceGroupAuthorityLevel(
      // updateAudienceGroupAuthorityLevelRequest: UpdateAudienceGroupAuthorityLevelRequest
      {} as unknown as UpdateAudienceGroupAuthorityLevelRequest, // paramName=updateAudienceGroupAuthorityLevelRequest
    );
    equal(scope.isDone(), true);
  });

  it("updateAudienceGroupDescription", async () => {
    const scope = nock("https://api.line.me", {
      reqheaders: {
        Authorization: `Bearer ${channel_access_token}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    })
      .put(u =>
        u.includes(
          "/v2/bot/audienceGroup/{audienceGroupId}/updateDescription".replace(
            "{audienceGroupId}",
            "0",
          ), // number
        ),
      )
      .reply(200, {});

    const res = await client.updateAudienceGroupDescription(
      // audienceGroupId: number
      0, // paramName=audienceGroupId(number or int or long)
      // updateAudienceGroupDescriptionRequest: UpdateAudienceGroupDescriptionRequest
      {} as unknown as UpdateAudienceGroupDescriptionRequest, // paramName=updateAudienceGroupDescriptionRequest
    );
    equal(scope.isDone(), true);
  });
});
