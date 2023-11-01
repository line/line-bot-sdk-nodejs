import { MessagingApiBlobClient } from "../../api";

import { GetMessageContentTranscodingResponse } from "../../model/getMessageContentTranscodingResponse";

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { deepEqual, equal } from "assert";

const pkg = require("../../../../package.json");

const channel_access_token = "test_channel_access_token";

describe("MessagingApiBlobClient", () => {
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

  const client = new MessagingApiBlobClient({
    channelAccessToken: channel_access_token,
  });

  it("getMessageContent", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api-data.line.me/v2/bot/message/{messageId}/content".replace(
        "{messageId}",
        "DUMMY",
      ); // string

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

    const res = await client.getMessageContent(
      // messageId: string
      "DUMMY", // messageId(string)
    );

    equal(requestCount, 1);
  });

  it("getMessageContentPreview", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api-data.line.me/v2/bot/message/{messageId}/content/preview".replace(
        "{messageId}",
        "DUMMY",
      ); // string

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

    const res = await client.getMessageContentPreview(
      // messageId: string
      "DUMMY", // messageId(string)
    );

    equal(requestCount, 1);
  });

  it("getMessageContentTranscodingByMessageId", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api-data.line.me/v2/bot/message/{messageId}/content/transcoding".replace(
        "{messageId}",
        "DUMMY",
      ); // string

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

    const res = await client.getMessageContentTranscodingByMessageId(
      // messageId: string
      "DUMMY", // messageId(string)
    );

    equal(requestCount, 1);
  });

  it("getRichMenuImage", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api-data.line.me/v2/bot/richmenu/{richMenuId}/content".replace(
        "{richMenuId}",
        "DUMMY",
      ); // string

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

    const res = await client.getRichMenuImage(
      // richMenuId: string
      "DUMMY", // richMenuId(string)
    );

    equal(requestCount, 1);
  });

  it("setRichMenuImage", async () => {
    let requestCount = 0;

    const endpoint =
      "https://api-data.line.me/v2/bot/richmenu/{richMenuId}/content".replace(
        "{richMenuId}",
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

    const res = await client.setRichMenuImage(
      // richMenuId: string
      "DUMMY", // richMenuId(string)
      // body: Blob
      new Blob([]), // paramName=body
    );

    equal(requestCount, 1);
  });
});
