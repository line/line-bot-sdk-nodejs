# Message and event objects

The message objects and event objects are plain JS objects with no
abstraction. This SDK provides TypeScript types for them, which can be imported
from `@line/bot-sdk`.

Please beware that the types only work in TypeScript, and will be removed when
built into JavaScript.

``` typescript
import {
  // webhook event objects
  WebhookEvent,
  MessageEvent,
  EventSource,
  VideoEventMessage,

  // message event objects
  Message,
  TemplateMessage,
  TemplateContent,
} from "@line/bot-sdk";
```

For the actual type definitions, please refer to [types.ts](https://github.com/line/line-bot-sdk-nodejs/blob/master/lib/types.ts)
directly.

You can also refer to the official specification:

- [Message objects](https://developers.line.me/en/docs/messaging-api/reference/#message-objects)
- [Webhook event objects](https://developers.line.me/en/docs/messaging-api/reference/#webhook-event-objects)
