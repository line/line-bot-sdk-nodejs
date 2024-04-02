import { webhook } from "../lib/index.js";

import { describe, it } from "vitest";

describe("webhook", () => {
  it("event", async () => {
    const event: webhook.Event = {
      type: "message",
      replyToken: "aaaa",
      message: {
        type: "text",
        id: "aaaaaa",
        text: "hello",
        quoteToken: "bbbbbb",
      },
      timestamp: 333333,
      mode: "active",
      webhookEventId: "cccccc",
      deliveryContext: {
        isRedelivery: false,
      },
    };

    console.assert(event.type === "message");
  });

  it("unknownEvent", async () => {
    const event: webhook.Event = {
      type: "greatNewEvent",
      greatNewField: "aaaa",
      timestamp: 333333,
      mode: "active",
      webhookEventId: "cccccc",
      deliveryContext: {
        isRedelivery: false,
      },
    };

    console.assert(event.type === "greatNewEvent");
  });
});
