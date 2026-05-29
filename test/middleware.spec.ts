import { deepEqual, equal, ok } from "node:assert";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import middleware from "../lib/middleware.js";
import * as webhook from "../lib/webhook/api.js";
import { close, listen } from "./helpers/test-server.js";

import { describe, it, beforeAll, afterAll, afterEach } from "vitest";

const TEST_PORT = parseInt(process.env.TEST_PORT || "1234", 10);

const m = middleware({ channelSecret: "test_channel_secret" });

const getRecentReq = (): { body: webhook.CallbackRequest } =>
  JSON.parse(readFileSync(join(__dirname, "helpers/request.json")).toString());

const DESTINATION = "Uaaaabbbbccccddddeeeeffff";

async function postJSON(
  baseURL: string,
  path: string,
  body: any,
  headers: Record<string, string> = {},
): Promise<Response> {
  return fetch(`${baseURL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

async function postText(
  baseURL: string,
  path: string,
  body: string,
  headers: Record<string, string> = {},
): Promise<Response> {
  return fetch(`${baseURL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      ...headers,
    },
    body,
  });
}

describe("middleware test", () => {
  const webhookEvent: webhook.MessageEvent = {
    message: {
      id: "test_event_message_id",
      text: "this is test message.😄😅😢😞😄😅😢😞",
      quoteToken: "test_quote_token",
      type: "text",
    },
    replyToken: "test_reply_token",
    source: {
      groupId: "test_group_id",
      type: "group",
    },
    webhookEventId: "test_webhook_event_id",
    deliveryContext: {
      isRedelivery: false,
    },
    timestamp: 0,
    mode: "active",
    type: "message",
  };

  const webhookSignature = {
    "X-Line-Signature": "eRdWYcVCzZV3MVZ3M9/rHJCl/a3oSbsRb04cLovpVwM=",
  };

  const baseURL = `http://localhost:${TEST_PORT}`;

  beforeAll(() => {
    listen(TEST_PORT, m);
  });

  describe("With skipSignatureVerification functionality", () => {
    let serverPort: number;

    afterEach(() => {
      if (serverPort) {
        close(serverPort);
      }
    });

    it("should skip signature verification when skipSignatureVerification returns true", async () => {
      serverPort = TEST_PORT + 1;
      const m = middleware({
        channelSecret: "test_channel_secret",
        skipSignatureVerification: () => true,
      });
      await listen(serverPort, m);

      const res = await postJSON(
        `http://localhost:${serverPort}`,
        "/webhook",
        { events: [webhookEvent], destination: DESTINATION },
        { "X-Line-Signature": "invalid_signature" },
      );
      equal(res.status, 200);

      const req = getRecentReq();
      deepEqual(req.body.destination, DESTINATION);
      deepEqual(req.body.events, [webhookEvent]);
    });

    it("should skip signature verification when skipSignatureVerification returns false", async () => {
      serverPort = TEST_PORT + 2;
      const m = middleware({
        channelSecret: "test_channel_secret",
        skipSignatureVerification: () => false,
      });
      await listen(serverPort, m);

      const res = await postJSON(
        `http://localhost:${serverPort}`,
        "/webhook",
        { events: [webhookEvent], destination: DESTINATION },
        { "X-Line-Signature": "invalid_signature" },
      );
      equal(res.status, 401);
    });
  });

  afterAll(() => {
    close(TEST_PORT);
  });

  describe("Succeeds on parsing valid request", () => {
    const testCases = [
      {
        describe: "standard webhook request",
        path: `/webhook`,
      },

      {
        describe: "pre-parsed string",
        path: `/mid-text`,
      },

      {
        describe: "pre-parsed buffer",
        path: `/mid-buffer`,
      },

      {
        describe: "pre-parsed buffer in rawBody",
        path: `/mid-rawbody`,
      },
    ];

    testCases.forEach(({ describe, path }) => {
      it(describe, async () => {
        const res = await postJSON(
          baseURL,
          path,
          { events: [webhookEvent], destination: DESTINATION },
          webhookSignature,
        );
        equal(res.status, 200);

        const req = getRecentReq();
        deepEqual(req.body.destination, DESTINATION);
        deepEqual(req.body.events, [webhookEvent]);
      });
    });
  });

  describe("Fails on parsing invalid request", () => {
    describe("invalid data request(test status)", () => {
      interface InvalidDataRequest {
        description: string;
        setup: () => Promise<Response>;
        expectedStatus: number;
      }

      const testCases: InvalidDataRequest[] = [
        {
          description:
            "parsing raw as it's not a valid request and should be catched",
          setup: async () => {
            return postJSON(
              baseURL,
              `/webhook`,
              { events: [webhookEvent], destination: DESTINATION },
              {
                "X-Line-Signature":
                  "wqJD7WAIZhWcXThMCf8jZnwG3Hmn7EF36plkQGkj48w=",
                "Content-Encoding": "1",
              },
            );
          },
          expectedStatus: 401,
        },

        {
          description: "pre-parsed json",
          setup: async () => {
            return postJSON(
              baseURL,
              `/mid-json`,
              { events: [webhookEvent], destination: DESTINATION },
              webhookSignature,
            );
          },
          expectedStatus: 401,
        },

        {
          description: "wrong signature",
          setup: async () => {
            return postJSON(
              baseURL,
              `/webhook`,
              { events: [webhookEvent], destination: DESTINATION },
              {
                "X-Line-Signature":
                  "WqJD7WAIZhWcXThMCf8jZnwG3Hmn7EF36plkQGkj48w=",
              },
            );
          },
          expectedStatus: 401,
        },

        {
          description: "wrong signature (length)",
          setup: async () => {
            return postJSON(
              baseURL,
              `/webhook`,
              { events: [webhookEvent], destination: DESTINATION },
              { "X-Line-Signature": "WqJD7WAIZ6plkQGkj48w=" },
            );
          },
          expectedStatus: 401,
        },

        {
          description: "invalid JSON",
          setup: async () => {
            return postText(baseURL, `/webhook`, "i am not jason", {
              "X-Line-Signature":
                "Z8YlPpm0lQOqPipiCHVbiuwIDIzRzD7w5hvHgmwEuEs=",
            });
          },
          expectedStatus: 400,
        },

        {
          description: "empty signature",
          setup: async () => {
            return postJSON(baseURL, `/webhook`, {
              events: [webhookEvent],
              destination: DESTINATION,
            });
          },
          expectedStatus: 401,
        },
      ];

      testCases.forEach(({ description, setup, expectedStatus }) => {
        it(description, async () => {
          const res = await setup();
          equal(res.status, expectedStatus);
        });
      });
    });

    describe("Invalid data request(test message)", () => {
      const testCases = [
        {
          description: "construct with no channelSecret",
          setup: () => {
            middleware({ channelSecret: null as unknown as string }); // Intentionally passing null to test runtime validation.
          },
          expectedMessage: "no channel secret",
        },
      ];

      testCases.forEach(({ description, setup, expectedMessage }) => {
        it(description, () => {
          try {
            setup();
            ok(false);
          } catch (err) {
            equal((err as Error).message, expectedMessage);
          }
        });
      });
    });
  });
});
