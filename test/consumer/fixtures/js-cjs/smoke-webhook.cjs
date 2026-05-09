const assert = require("node:assert/strict");
const { createHmac } = require("node:crypto");
const { createServer } = require("node:http");
const { once } = require("node:events");
const { middleware } = require("@line/bot-sdk");

const channelSecret = "channel-secret";

const makeSignature = (body) => {
  return createHmac("sha256", channelSecret).update(body).digest("base64");
};

const mw = middleware({ channelSecret });

const server = createServer((req, res) => {
  mw(req, res, (err) => {
    if (err) {
      res.statusCode = 401;
      res.end("invalid");
      return;
    }

    assert.equal(Array.isArray(req.body.events), true);
    res.statusCode = 200;
    res.end("ok");
  });
});

async function main() {
  server.listen(0, "127.0.0.1");
  await once(server, "listening");

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("failed to determine server address");
  }

  const url = `http://127.0.0.1:${address.port}/webhook`;

  const payload = JSON.stringify({
    destination: "UDEST",
    events: [{ type: "message", message: { type: "text", text: "hi" } }],
  });

  try {
    const okRes = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-line-signature": makeSignature(payload),
      },
      body: payload,
    });
    assert.equal(okRes.status, 200);

    const ngRes = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-line-signature": "invalid-signature",
      },
      body: payload,
    });
    assert.equal(ngRes.status, 401);
  } finally {
    server.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
