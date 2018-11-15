import { deepEqual, equal } from "assert";
import { readFileSync } from "fs";
import { join } from "path";
import { HTTPError } from "../lib/exceptions";
import HTTPClient from "../lib/http";
import middleware from "../lib/middleware";
import * as Types from "../lib/types";
import { close, listen } from "./helpers/test-server";

const TEST_PORT = parseInt(process.env.TEST_PORT, 10);

const m = middleware({ channelSecret: "test_channel_secret" });

const getRecentReq = (): { body: Types.WebhookRequestBody } =>
  JSON.parse(readFileSync(join(__dirname, "helpers/request.json")).toString());

describe("middleware", () => {
  const http = (
    headers: any = {
      "X-Line-Signature": "wqJD7WAIZhWcXThMCf8jZnwG3Hmn7EF36plkQGkj48w=",
    },
  ) => new HTTPClient(`http://localhost:${TEST_PORT}`, headers);

  before(() => listen(TEST_PORT, m));
  after(() => close());

  const webhook: Types.MessageEvent = {
    message: {
      id: "test_event_message_id",
      text: "this is test message.",
      type: "text",
    },
    replyToken: "test_reply_token",
    source: {
      groupId: "test_group_id",
      type: "group",
    },
    timestamp: 0,
    type: "message",
  };

  it("succeed", () => {
    return http()
      .post(`/webhook`, {
        events: [webhook],
        destination: "Uaaaabbbbccccddddeeeeffff",
      })
      .then(() => {
        const req = getRecentReq();
        deepEqual(req.body.destination, "Uaaaabbbbccccddddeeeeffff");
        deepEqual(req.body.events, [webhook]);
      });
  });

  it("succeed with pre-parsed string", () => {
    return http()
      .post(`/mid-text`, {
        events: [webhook],
        destination: "Uaaaabbbbccccddddeeeeffff",
      })
      .then(() => {
        const req = getRecentReq();
        deepEqual(req.body.destination, "Uaaaabbbbccccddddeeeeffff");
        deepEqual(req.body.events, [webhook]);
      });
  });

  it("succeed with pre-parsed buffer", () => {
    return http()
      .post(`/mid-buffer`, {
        events: [webhook],
        destination: "Uaaaabbbbccccddddeeeeffff",
      })
      .then(() => {
        const req = getRecentReq();
        deepEqual(req.body.destination, "Uaaaabbbbccccddddeeeeffff");
        deepEqual(req.body.events, [webhook]);
      });
  });

  it("succeed with pre-parsed buffer in rawBody", () => {
    return http()
      .post(`/mid-rawbody`, {
        events: [webhook],
        destination: "Uaaaabbbbccccddddeeeeffff",
      })
      .then(() => {
        const req = getRecentReq();
        deepEqual(req.body.destination, "Uaaaabbbbccccddddeeeeffff");
        deepEqual(req.body.events, [webhook]);
      });
  });

  it("fails on wrong signature", () => {
    return http({
      "X-Line-Signature": "WqJD7WAIZhWcXThMCf8jZnwG3Hmn7EF36plkQGkj48w=",
    })
      .post(`/webhook`, {
        events: [webhook],
        destination: "Uaaaabbbbccccddddeeeeffff",
      })
      .catch((err: HTTPError) => {
        equal(err.statusCode, 401);
      });
  });

  it("fails on invalid JSON", () => {
    return http({
      "X-Line-Signature": "Z8YlPpm0lQOqPipiCHVbiuwIDIzRzD7w5hvHgmwEuEs=",
    })
      .post(`/webhook`, "i am not jason")
      .catch((err: HTTPError) => {
        equal(err.statusCode, 400);
      });
  });

  it("fails on empty signature", () => {
    return http({})
      .post(`/webhook`, {
        events: [webhook],
        destination: "Uaaaabbbbccccddddeeeeffff",
      })
      .then((res: any) => {
        throw new Error();
      })
      .catch((err: any) => {
        if (err instanceof HTTPError) {
          equal(err.statusCode, 401);
        } else {
          throw err;
        }
      });
  });
});
