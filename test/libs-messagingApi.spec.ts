import { messagingApi, shop } from "../lib";
import { deepEqual, equal, ok } from "assert";
import { TestServer } from "./helpers/server";

const pkg = require("../package.json");

const channelAccessToken = "test_channel_access_token";

describe("messagingApi", () => {
  const server = new TestServer();
  beforeEach(async () => {
    server.reset();
    await server.listen();
  });
  afterEach(async () => {
    await server.close();
  });

  it("setRichMenuImage", async () => {
    server.setHandler((req, res) => {
      equal(req.url, "/v2/bot/richmenu/aaaaaa/content");

      equal(req.headers.authorization, "Bearer test_channel_access_token");
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);
      equal(req.headers["content-type"], "image/jpeg");

      let body = "";
      req.on("data", chunk => {
        body += chunk;
      });

      req.on("end", () => {
        equal(body, "GREAT_JPEG");

        res.writeHead(200, { "Content-type": "application/json" });
        res.end(JSON.stringify({}));
      });
    });

    const blobClient = new messagingApi.MessagingApiBlobClient({
      channelAccessToken,
      baseURL: server.getUrl(),
    });

    const res = await blobClient.setRichMenuImage(
      "aaaaaa",
      new Blob(["GREAT_JPEG"], { type: "image/jpeg" }),
    );
    equal(server.getRequestCount(), 1);
    deepEqual(res, {});
  });

  it("pushMessage", async () => {
    server.setHandler((req, res) => {
      equal(req.url, "/v2/bot/message/push");

      equal(req.headers.authorization, "Bearer test_channel_access_token");
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);
      equal(req.headers["content-type"], "application/json");
      equal(req.headers["x-line-retry-key"], "KEYKEYKEYKEY");

      let body = "";
      req.on("data", chunk => {
        body += chunk;
      });

      req.on("end", () => {
        ok(body.includes("uAAAAAAAAAAAAAA"));

        res.writeHead(200, { "Content-type": "application/json" });
        res.end(JSON.stringify({}));
      });
    });

    const client = new messagingApi.MessagingApiClient({
      channelAccessToken,
      baseURL: server.getUrl(),
    });

    const res = await client.pushMessage(
      { to: "uAAAAAAAAAAAAAA", messages: [{ type: "text", text: "aaaaaa" }] },
      "KEYKEYKEYKEY",
    );
    equal(server.getRequestCount(), 1);
    deepEqual(res, {});
  });

  it("pushMessage without x-line-retry-key", async () => {
    server.setHandler((req, res) => {
      equal(req.url, "/v2/bot/message/push");

      equal(req.headers.authorization, "Bearer test_channel_access_token");
      equal(req.headers["user-agent"], `${pkg.name}/${pkg.version}`);
      equal(req.headers["content-type"], "application/json");
      equal(req.headers["x-line-retry-key"], undefined);

      let body = "";
      req.on("data", chunk => {
        body += chunk;
      });

      req.on("end", () => {
        ok(body.includes("uAAAAAAAAAAAAAA"));

        res.writeHead(200, { "Content-type": "application/json" });
        res.end(JSON.stringify({}));
      });
    });

    const client = new messagingApi.MessagingApiClient({
      channelAccessToken,
      baseURL: server.getUrl(),
    });

    const res = await client.pushMessage(
      { to: "uAAAAAAAAAAAAAA", messages: [{ type: "text", text: "aaaaaa" }] },
      undefined,
    );
    equal(server.getRequestCount(), 1);
    deepEqual(res, {});
  });

  it("pushMessage without xLineRetryKey", async () => {
    let requestCount = 0;
    server.use(
      http.post(
        "https://api.line.me/v2/bot/message/push",
        ({ request, params, cookies }) => {
          requestCount++;

          equal(
            request.headers.get("Authorization"),
            "Bearer test_channel_access_token",
          );
          equal(
            request.headers.get("User-Agent"),
            `${pkg.name}/${pkg.version}`,
          );
          equal(request.headers.get("content-type"), "application/json");
          equal(request.headers.get("x-line-retry-key"), undefined);
          return HttpResponse.json({});
        },
      ),
    );

    const res = await client.pushMessage(
      { to: "uAAAAAAAAAAAAAA", messages: [{ type: "text", text: "aaaaaa" }] },
      undefined,
    );
    equal(requestCount, 1);
    deepEqual(res, {});
  });
});
