import { deepEqual, equal } from "assert";
import { HTTPError } from "../lib/exceptions";
import { post } from "../lib/http";
import middleware from "../lib/middleware";
import { close, listen } from "./helpers/test-server";

const TEST_PORT = parseInt(process.env.TEST_PORT, 10);
const TEST_URL = `http://localhost:${TEST_PORT}`;

let stringifyBody: (body: any) => string | Buffer = null;

const m = middleware((() => {
  const c = {
    channelSecret: "test_channel_secret",
  };

  Object.defineProperty(c, "stringifyBody", {
    get() { return stringifyBody; },
  });

  return c;
})());

describe("middleware", () => {
  before(() => listen(TEST_PORT, m));
  after(() => close());
  afterEach(() => { stringifyBody = null; });

  const webhook: Line.MessageEvent = {
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
    const auth: any = { "X-Line-Signature": "qeDy61PbQK+aO97Bs8zjaFgYjQxFruGd13pfXPQoBRU=" };

    return post(`${TEST_URL}/webhook`, auth, { events: [webhook] })
      .then((res: any) => {
        deepEqual(res.body.events, [webhook]);
      });
  });

  it("succeed with pre-parsed string", () => {
    const auth: any = { "X-Line-Signature": "qeDy61PbQK+aO97Bs8zjaFgYjQxFruGd13pfXPQoBRU=" };

    return post(`${TEST_URL}/mid-text`, auth, { events: [webhook] })
      .then((res: any) => {
        deepEqual(res.body.events, [webhook]);
      });
  });

  it("succeed with pre-parsed buffer", () => {
    const auth: any = { "X-Line-Signature": "qeDy61PbQK+aO97Bs8zjaFgYjQxFruGd13pfXPQoBRU=" };

    return post(`${TEST_URL}/mid-buffer`, auth, { events: [webhook] })
      .then((res: any) => {
        deepEqual(res.body.events, [webhook]);
      });
  });

  it("succeed with pre-parsed object, with stringifyBody opt", () => {
    const auth: any = { "X-Line-Signature": "qeDy61PbQK+aO97Bs8zjaFgYjQxFruGd13pfXPQoBRU=" };
    stringifyBody = JSON.stringify;

    return post(`${TEST_URL}/mid-json`, auth, { events: [webhook] })
      .then((res: any) => {
        deepEqual(res.body.events, [webhook]);
      });
  });

  it("fails on wrong signature", () => {
    const auth: any = { "X-Line-Signature": "qeDy61PbQK+aO97Bs8zjbFgYjQxFruGd13pfXPQoBRU=" };

    return post(`${TEST_URL}/webhook`, auth, { events: [webhook] })
      .catch((err: HTTPError) => {
        equal(err.statusCode, 401);
      });
  });

  it("fails on invalid JSON", () => {
    const auth: any = { "X-Line-Signature": "EqtMVtbumD+AWcprLA6Ty/KsHAN910X7x9EogZkXRHU=" };

    return post(`${TEST_URL}/webhook`, auth, "i am not jason")
      .catch((err: HTTPError) => {
        equal(err.statusCode, 400);
      });
  });

  it("fail with pre-parsed object, without stringifyBody opt", () => {
    const auth: any = { "X-Line-Signature": "qeDy61PbQK+aO97Bs8zjaFgYjQxFruGd13pfXPQoBRU=" };

    return post(`${TEST_URL}/mid-json`, auth, { events: [webhook] })
      .catch((err: HTTPError) => {
        equal(err.statusCode, 401);
      });
  });
});
