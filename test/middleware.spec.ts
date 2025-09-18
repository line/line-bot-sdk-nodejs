import { deepEqual, equal, ok } from "node:assert";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HTTPError } from "../lib/exceptions.js";
import HTTPClient from "../lib/http-axios.js";
import middleware from "../lib/middleware.js";
import * as Types from "../lib/types.js";
import { close, listen } from "./helpers/test-server.js";

import { describe, it, beforeAll, afterAll, afterEach } from "vitest";

const TEST_PORT = parseInt(process.env.TEST_PORT || "1234", 10);

const m = middleware({ channelSecret: "test_channel_secret" });

// Middleware with skipSignatureVerification function (always true)
const mWithSkipAlwaysTrue = middleware({
  channelSecret: "test_channel_secret",
  skipSignatureVerification: () => true,
});

// Middleware with skipSignatureVerification function (dynamic behavior based on environment variable)
let shouldSkipSignature = false;
const mWithDynamicSkip = middleware({
  channelSecret: "test_channel_secret",
  skipSignatureVerification: () => shouldSkipSignature,
});

const getRecentReq = (): { body: Types.WebhookRequestBody } =>
  JSON.parse(readFileSync(join(__dirname, "helpers/request.json")).toString());

const DESTINATION = "Uaaaabbbbccccddddeeeeffff";

describe("middleware test", () => {
  const webhook: Types.MessageEvent = {
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

  const http = (headers: any = { ...webhookSignature }) =>
    new HTTPClient({
      baseURL: `http://localhost:${TEST_PORT}`,
      defaultHeaders: headers,
    });

  beforeAll(() => {
    listen(TEST_PORT, m);
  });

  describe("With skipSignatureVerification functionality", () => {
    // Port for always-true skip function
    let alwaysTruePort: number;
    // Port for dynamic skip function
    let dynamicSkipPort: number;

    beforeAll(() => {
      alwaysTruePort = TEST_PORT + 1;
      dynamicSkipPort = TEST_PORT + 2;
      listen(alwaysTruePort, mWithSkipAlwaysTrue);
      return listen(dynamicSkipPort, mWithDynamicSkip);
    });

    afterAll(() => {
      close(alwaysTruePort);
      return close(dynamicSkipPort);
    });

    it("should skip signature verification when skipSignatureVerification returns true", async () => {
      const client = new HTTPClient({
        baseURL: `http://localhost:${alwaysTruePort}`,
        defaultHeaders: {
          "X-Line-Signature": "invalid_signature",
        },
      });

      // This should work even with invalid signature because verification is skipped
      await client.post("/webhook", {
        events: [webhook],
        destination: DESTINATION,
      });

      const req = getRecentReq();
      deepEqual(req.body.destination, DESTINATION);
      deepEqual(req.body.events, [webhook]);
    });

    it("should respect dynamic skipSignatureVerification behavior - when true", async () => {
      // Set to skip verification
      shouldSkipSignature = true;

      const client = new HTTPClient({
        baseURL: `http://localhost:${dynamicSkipPort}`,
        defaultHeaders: {
          "X-Line-Signature": "invalid_signature",
        },
      });

      // This should work even with invalid signature because verification is skipped
      await client.post("/webhook", {
        events: [webhook],
        destination: DESTINATION,
      });

      const req = getRecentReq();
      deepEqual(req.body.destination, DESTINATION);
      deepEqual(req.body.events, [webhook]);
    });

    it("should respect dynamic skipSignatureVerification behavior - when false", async () => {
      // Set to NOT skip verification
      shouldSkipSignature = false;

      const client = new HTTPClient({
        baseURL: `http://localhost:${dynamicSkipPort}`,
        defaultHeaders: {
          "X-Line-Signature": "invalid_signature",
        },
      });

      try {
        // This should fail because signature verification is not skipped
        await client.post("/webhook", {
          events: [webhook],
          destination: DESTINATION,
        });
        ok(false, "Expected to throw an error due to invalid signature");
      } catch (err) {
        if (err instanceof HTTPError) {
          equal(err.statusCode, 401);
        } else {
          throw err;
        }
      }
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
        await http().post(path, {
          events: [webhook],
          destination: DESTINATION,
        });

        const req = getRecentReq();
        deepEqual(req.body.destination, DESTINATION);
        deepEqual(req.body.events, [webhook]);
      });
    });
  });

  describe("Fails on parsing invalid request", () => {
    describe("invalid data request(test status)", () => {
      interface InvalidDataRequest {
        description: string;
        setup: () => Promise<any>;
        expectedError: any;
        expectedStatus: number;
      }

      const testCases: InvalidDataRequest[] = [
        {
          description:
            "parsing raw as it's not a valid request and should be catched",
          setup: async () => {
            return http({
              "X-Line-Signature":
                "wqJD7WAIZhWcXThMCf8jZnwG3Hmn7EF36plkQGkj48w=",
              "Content-Encoding": 1,
            }).post(`/webhook`, {
              events: [webhook],
              destination: DESTINATION,
            });
          },
          expectedError: HTTPError,
          expectedStatus: 401,
        },

        {
          description: "pre-parsed json",
          setup: async () => {
            return http().post(`/mid-json`, {
              events: [webhook],
              destination: DESTINATION,
            });
          },
          expectedError: HTTPError,
          expectedStatus: 401,
        },

        {
          description: "wrong signature",
          setup: async () => {
            return await http({
              "X-Line-Signature":
                "WqJD7WAIZhWcXThMCf8jZnwG3Hmn7EF36plkQGkj48w=",
            }).post(`/webhook`, {
              events: [webhook],
              destination: DESTINATION,
            });
          },
          expectedError: HTTPError,
          expectedStatus: 401,
        },

        {
          description: "wrong signature (length)",
          setup: async () => {
            return http({
              "X-Line-Signature": "WqJD7WAIZ6plkQGkj48w=",
            }).post(`/webhook`, {
              events: [webhook],
              destination: DESTINATION,
            });
          },
          expectedError: HTTPError,
          expectedStatus: 401,
        },

        {
          description: "invalid JSON",
          setup: async () => {
            return http({
              "X-Line-Signature":
                "Z8YlPpm0lQOqPipiCHVbiuwIDIzRzD7w5hvHgmwEuEs=",
            }).post(`/webhook`, "i am not jason", {
              headers: { "Content-Type": "text/plain" },
            });
          },
          expectedError: HTTPError,
          expectedStatus: 400,
        },

        {
          description: "empty signature",
          setup: async () => {
            return http({}).post(`/webhook`, {
              events: [webhook],
              destination: DESTINATION,
            });
          },
          expectedError: HTTPError,
          expectedStatus: 401,
        },
      ];

      testCases.forEach(
        ({ description, setup, expectedError, expectedStatus }) => {
          it(description, async () => {
            try {
              await setup();
              ok(false);
            } catch (err) {
              if (err instanceof expectedError) {
                equal(err.statusCode, expectedStatus);
              } else {
                throw err;
              }
            }
          });
        },
      );
    });

    describe("Invalid data request(test message)", () => {
      const testCases = [
        {
          description: "construct with no channelSecret",
          setup: () => {
            middleware({ channelSecret: null });
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
            equal(err.message, expectedMessage);
          }
        });
      });
    });
  });
});
