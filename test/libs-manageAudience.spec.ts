import { manageAudience } from "../lib/index.js";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal, match, ok, strictEqual } from "node:assert";

import { describe, it, beforeAll, afterAll, afterEach } from "vitest";

const channelAccessToken = "test_channel_access_token";

const client = new manageAudience.ManageAudienceClient({
  channelAccessToken,
});

const blobClient = new manageAudience.ManageAudienceBlobClient({
  channelAccessToken,
});

describe("manageAudience", () => {
  const server = setupServer();
  beforeAll(() => {
    server.listen();
  });
  afterAll(() => {
    server.close();
  });
  afterEach(() => {
    server.resetHandlers();
  });

  it("createAudienceForUploadingUserIds", async () => {
    let requestCount = 0;
    server.use(
      http.post(
        "https://api-data.line.me/v2/bot/audienceGroup/upload/byFile",
        ({ request }) => {
          requestCount++;

          equal(
            request.headers.get("Authorization"),
            `Bearer test_channel_access_token`,
          );
          equal(request.headers.get("User-Agent"), "@line/bot-sdk/1.0.0-test");
          match(
            request.headers.get("content-type")!!,
            /^multipart\/form-data; boundary=.*$/,
          );

          return HttpResponse.json({});
        },
      ),
    );

    const res = await blobClient.createAudienceForUploadingUserIds(
      new Blob(["c9161b19-57f8-46c2-a71f-dfa87314dabe"], {
        type: "text/plain",
      }),
      "test_description",
      true,
    );
    equal(requestCount, 1);
    deepEqual(res, {});
  });

  it("deleteAudienceGroupWithHttpInfo builds path from numeric audienceGroupId", async () => {
    let requestCount = 0;
    server.use(
      http.delete(
        "https://api.line.me/v2/bot/audienceGroup/0",
        ({ request }) => {
          requestCount++;

          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          return HttpResponse.json({});
        },
      ),
    );

    const res = await client.deleteAudienceGroupWithHttpInfo(0);
    equal(requestCount, 1);
    deepEqual(res.body, {});
  });

  it("getSharedAudienceDataWithHttpInfo builds path from numeric audienceGroupId", async () => {
    let requestCount = 0;
    server.use(
      http.get(
        "https://api.line.me/v2/bot/audienceGroup/shared/12345",
        ({ request }) => {
          requestCount++;

          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          return HttpResponse.json({});
        },
      ),
    );

    const res = await client.getSharedAudienceDataWithHttpInfo(12345);
    equal(requestCount, 1);
    deepEqual(res.body, {});
  });

  it("updateAudienceGroupDescriptionWithHttpInfo builds path from numeric audienceGroupId", async () => {
    let requestCount = 0;
    server.use(
      http.put(
        "https://api.line.me/v2/bot/audienceGroup/999/updateDescription",
        async ({ request }) => {
          requestCount++;

          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          deepEqual(await request.json(), { description: "renamed-audience" });
          return HttpResponse.json({});
        },
      ),
    );

    const res = await client.updateAudienceGroupDescriptionWithHttpInfo(999, {
      description: "renamed-audience",
    });
    equal(requestCount, 1);
    deepEqual(res.body, {});
  });

  it("createAudienceForUploadingUserIds omits undefined optional fields", async () => {
    let received: FormData | null = null;
    server.use(
      http.post(
        "https://api-data.line.me/v2/bot/audienceGroup/upload/byFile",
        async ({ request }) => {
          received = await request.formData();
          return HttpResponse.json({});
        },
      ),
    );

    const file = new Blob(["user-id-1"], { type: "text/plain" });
    await blobClient.createAudienceForUploadingUserIds(file);

    const form: FormData = received!;
    ok(form);
    ok(form.get("file") instanceof File);
    strictEqual(form.has("description"), false);
    strictEqual(form.has("isIfaAudience"), false);
    strictEqual(form.has("uploadDescription"), false);
  });

  it("addUserIdsToAudience omits undefined optional fields", async () => {
    let received: FormData | null = null;
    server.use(
      http.put(
        "https://api-data.line.me/v2/bot/audienceGroup/upload/byFile",
        async ({ request }) => {
          received = await request.formData();
          return HttpResponse.json({});
        },
      ),
    );

    const file = new Blob(["user-id-1"], { type: "text/plain" });
    await blobClient.addUserIdsToAudience(file);

    const form: FormData = received!;
    ok(form);
    ok(form.get("file") instanceof File);
    strictEqual(form.has("audienceGroupId"), false);
    strictEqual(form.has("uploadDescription"), false);
  });

  it("createAudienceForUploadingUserIds preserves false for isIfaAudience", async () => {
    let received: FormData | null = null;
    server.use(
      http.post(
        "https://api-data.line.me/v2/bot/audienceGroup/upload/byFile",
        async ({ request }) => {
          received = await request.formData();
          return HttpResponse.json({});
        },
      ),
    );

    const file = new Blob(["user-id-1"], { type: "text/plain" });
    await blobClient.createAudienceForUploadingUserIds(
      file,
      "test_description",
      false,
    );

    const form: FormData = received!;
    ok(form);
    strictEqual(form.get("isIfaAudience"), "false");
    strictEqual(form.get("description"), "test_description");
  });
});
