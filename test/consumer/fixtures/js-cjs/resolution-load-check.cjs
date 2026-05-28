const assert = require("node:assert/strict");
const sdk = require("@line/bot-sdk");

assert.equal(typeof sdk.middleware, "function");
assert.equal(typeof sdk.LineBotClient.fromChannelAccessToken, "function");

const client = sdk.LineBotClient.fromChannelAccessToken({
  channelAccessToken: "DUMMY_TOKEN",
});
assert.equal(typeof client.getBotInfo, "function");
