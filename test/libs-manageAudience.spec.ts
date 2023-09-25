import {manageAudience} from "../lib";
import * as nock from "nock";
import {deepEqual, equal} from "assert";

const pkg = require("../package.json");

const channelAccessToken = "test_channel_access_token";

const client = new manageAudience.ManageAudienceClient({
    channelAccessToken,
});

const blobClient = new manageAudience.ManageAudienceBlobClient({
    channelAccessToken,
});

describe("manageAudience", () => {
    before(() => nock.disableNetConnect());
    afterEach(() => nock.cleanAll());
    after(() => nock.enableNetConnect());

    it("createAudienceForUploadingUserIds", async () => {
        const scope = nock("https://api-data.line.me/", {
            reqheaders: {
                Authorization: "Bearer test_channel_access_token",
                "User-Agent": `${pkg.name}/${pkg.version}`,
                "content-type": /^multipart\/form-data; boundary=.*$/,
            },
        })
            .post("/v2/bot/audienceGroup/upload/byFile", /.*boundary.*/)
            .reply(200, {});

        const res = await blobClient.createAudienceForUploadingUserIds(
            new Blob(["c9161b19-57f8-46c2-a71f-dfa87314dabe"], {type: "text/plain"}),
            "test_description",
            true,
        );
        equal(scope.isDone(), true);
        deepEqual(res, {});
    });
});
