const assert = require("node:assert/strict");
const { createServer } = require("node:http");
const { once } = require("node:events");
const { LineBotClient } = require("@line/bot-sdk");

const requests = [];
const server = createServer(async (req, res) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString("utf8");
  requests.push({
    method: req.method,
    url: req.url,
    auth: req.headers.authorization,
    body,
  });

  if (req.method === "GET" && req.url === "/v2/bot/info") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        userId: "U1234567890",
        basicId: "@testbot",
        displayName: "Test Bot",
      }),
    );
    return;
  }

  if (
    req.method === "GET" &&
    req.url === "/v2/bot/message/message-1/content/transcoding"
  ) {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ status: "succeeded" }));
    return;
  }

  if (req.method === "POST" && req.url === "/module/auth/v1/token") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ access_token: "module-token" }));
    return;
  }

  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ message: "Not Found" }));
});

async function main() {
  server.listen(0, "127.0.0.1");
  await once(server, "listening");

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("failed to determine server address");
  }

  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    const client = LineBotClient.fromChannelAccessToken({
      channelAccessToken: "DUMMY_TOKEN",
      apiBaseURL: baseUrl,
      dataApiBaseURL: baseUrl,
      managerBaseURL: baseUrl,
    });

    const botInfo = await client.getBotInfo();
    assert.equal(botInfo.displayName, "Test Bot");

    const transcoding =
      await client.getMessageContentTranscodingByMessageId("message-1");
    assert.equal(transcoding.status, "succeeded");

    await client.attachModule(
      "authorization_code",
      "code-1",
      "https://example.com/callback",
    );

    assert.equal(requests.length, 3);

    assert.deepEqual(
      requests.map(request => ({ method: request.method, url: request.url })),
      [
        { method: "GET", url: "/v2/bot/info" },
        {
          method: "GET",
          url: "/v2/bot/message/message-1/content/transcoding",
        },
        { method: "POST", url: "/module/auth/v1/token" },
      ],
    );

    for (const request of requests) {
      assert.equal(request.auth, "Bearer DUMMY_TOKEN");
    }

    const formBody = requests[2]?.body ?? "";
    assert.match(formBody, /grant_type=authorization_code/);
    assert.match(formBody, /code=code-1/);
    assert.match(formBody, /redirect_uri=https%3A%2F%2Fexample.com%2Fcallback/);
  } finally {
    server.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
