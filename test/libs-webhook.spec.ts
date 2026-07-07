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

  it("messageEditedEvent", async () => {
    const event: webhook.Event = {
      type: "messageEdited",
      replyToken: "aaaa",
      message: {
        type: "text",
        id: "aaaaaa",
        text: "hello edited",
        quoteToken: "bbbbbb",
      },
      timestamp: 333333,
      mode: "active",
      webhookEventId: "cccccc",
      deliveryContext: {
        isRedelivery: false,
      },
      source: {
        type: "group",
        groupId: "groupId",
        userId: "userId",
      },
    };

    console.assert(event.type === "messageEdited");
    if (event.type === "messageEdited") {
      console.assert(event.message.type === "text");
      console.assert(event.replyToken === "aaaa");
    }
  });

  it("unknownEvent", async () => {
    const event = {
      type: "greatNewEvent",
      greatNewField: "aaaa",
      timestamp: 333333,
      mode: "active",
      webhookEventId: "cccccc",
      deliveryContext: {
        isRedelivery: false,
      },
    } as unknown as webhook.Event; // Intentionally casting an unknown event type to test forward compatibility with new event types.

    console.assert(event.type === ("greatNewEvent" as string)); // Same reason as above.
  });
});
