import * as assert from "node:assert/strict";
import { LineBotClient, middleware } from "@line/bot-sdk";

assert.equal(typeof middleware, "function");
assert.equal(typeof LineBotClient.fromChannelAccessToken, "function");

const client = LineBotClient.fromChannelAccessToken({
  channelAccessToken: "DUMMY_TOKEN",
});
assert.equal(typeof client.getBotInfo, "function");
