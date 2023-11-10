import { messagingApi, shop } from "../lib";
import { createServer } from "http";
import { deepEqual, equal, ok } from "assert";

const pkg = require("../package.json");

const channelAccessToken = "test_channel_access_token";


describe("messagingApi", () => {
  it("setRichMenuImage", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

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
    await new Promise(resolve => {
      server.listen(0);
      server.on("listening", resolve);
    });

    const serverAddress = server.address();
    if (typeof serverAddress === "string" || serverAddress === null) {
      throw new Error("Unexpected server address: " + serverAddress);
    }

    const blobClient = new messagingApi.MessagingApiBlobClient({
      channelAccessToken,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await blobClient.setRichMenuImage(
      "aaaaaa",
      new Blob(["GREAT_JPEG"], { type: "image/jpeg" }),
    );
    equal(requestCount, 1);
    deepEqual(res, {});

    server.close();
  });

  it("pushMessage", async () => {
    let requestCount = 0;

    const server = createServer((req, res) => {
      requestCount++;

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
    await new Promise(resolve => {
      server.listen(0);
      server.on("listening", resolve);
    });

    const serverAddress = server.address();
    if (typeof serverAddress === "string" || serverAddress === null) {
      throw new Error("Unexpected server address: " + serverAddress);
    }

    const client = new messagingApi.MessagingApiClient({
      channelAccessToken,
      baseURL: `http://localhost:${String(serverAddress.port)}/`,
    });

    const res = await client.pushMessage(
      { to: "uAAAAAAAAAAAAAA", messages: [{ type: "text", text: "aaaaaa" }] },
      "KEYKEYKEYKEY",
    );
    equal(requestCount, 1);
    deepEqual(res, {});
    server.close();
  });
});
