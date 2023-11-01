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

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal } from "assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("ManageAudienceClient", () => {
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

  const client = new ManageAudienceClient({
    channelAccessToken: channel_access_token,
  });

  it("activateAudienceGroup", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/audienceGroup/{audienceGroupId}/activate".replace(
        "{audienceGroupId}",
        "0",
      ); // number

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

    const res = await client.activateAudienceGroup(
      // audienceGroupId: number
      0, // paramName=audienceGroupId(number or int or long)
    );

    equal(requestCount, 1);
  });

  it("addAudienceToAudienceGroup", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/audienceGroup/upload";

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

    const res = await client.addAudienceToAudienceGroup(
      // addAudienceToAudienceGroupRequest: AddAudienceToAudienceGroupRequest
      {} as unknown as AddAudienceToAudienceGroupRequest, // paramName=addAudienceToAudienceGroupRequest
    );

    equal(requestCount, 1);
  });

  it("createAudienceGroup", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/audienceGroup/upload";

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

    const res = await client.createAudienceGroup(
      // createAudienceGroupRequest: CreateAudienceGroupRequest
      {} as unknown as CreateAudienceGroupRequest, // paramName=createAudienceGroupRequest
    );

    equal(requestCount, 1);
  });

  it("createClickBasedAudienceGroup", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/audienceGroup/click";

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

    const res = await client.createClickBasedAudienceGroup(
      // createClickBasedAudienceGroupRequest: CreateClickBasedAudienceGroupRequest
      {} as unknown as CreateClickBasedAudienceGroupRequest, // paramName=createClickBasedAudienceGroupRequest
    );

    equal(requestCount, 1);
  });

  it("createImpBasedAudienceGroup", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/audienceGroup/imp";

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

    const res = await client.createImpBasedAudienceGroup(
      // createImpBasedAudienceGroupRequest: CreateImpBasedAudienceGroupRequest
      {} as unknown as CreateImpBasedAudienceGroupRequest, // paramName=createImpBasedAudienceGroupRequest
    );

    equal(requestCount, 1);
  });

  it("deleteAudienceGroup", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/audienceGroup/{audienceGroupId}".replace(
        "{audienceGroupId}",
        "0",
      ); // number

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

    const res = await client.deleteAudienceGroup(
      // audienceGroupId: number
      0, // paramName=audienceGroupId(number or int or long)
    );

    equal(requestCount, 1);
  });

  it("getAudienceData", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/audienceGroup/{audienceGroupId}".replace(
        "{audienceGroupId}",
        "0",
      ); // number

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

    const res = await client.getAudienceData(
      // audienceGroupId: number
      0, // paramName=audienceGroupId(number or int or long)
    );

    equal(requestCount, 1);
  });

  it("getAudienceGroupAuthorityLevel", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/audienceGroup/authorityLevel";

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

    const res = await client.getAudienceGroupAuthorityLevel();

    equal(requestCount, 1);
  });

  it("getAudienceGroups", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/audienceGroup/list"
      .replace("{page}", "0") // number
      .replace("{description}", "DUMMY") // string
      .replace("{size}", "0"); // number

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

    equal(requestCount, 1);
  });

  it("updateAudienceGroupAuthorityLevel", async () => {
    let requestCount = 0;

    const endpoint = "https://api.line.me/v2/bot/audienceGroup/authorityLevel";

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

    const res = await client.updateAudienceGroupAuthorityLevel(
      // updateAudienceGroupAuthorityLevelRequest: UpdateAudienceGroupAuthorityLevelRequest
      {} as unknown as UpdateAudienceGroupAuthorityLevelRequest, // paramName=updateAudienceGroupAuthorityLevelRequest
    );

    equal(requestCount, 1);
  });

  it("updateAudienceGroupDescription", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api.line.me/v2/bot/audienceGroup/{audienceGroupId}/updateDescription".replace(
        "{audienceGroupId}",
        "0",
      ); // number

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

    const res = await client.updateAudienceGroupDescription(
      // audienceGroupId: number
      0, // paramName=audienceGroupId(number or int or long)
      // updateAudienceGroupDescriptionRequest: UpdateAudienceGroupDescriptionRequest
      {} as unknown as UpdateAudienceGroupDescriptionRequest, // paramName=updateAudienceGroupDescriptionRequest
    );

    equal(requestCount, 1);
  });
});
