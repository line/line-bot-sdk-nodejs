# Client

Client is to send messages, get user or content information, or leave chats.
A client instance provides functions for [messaging APIs](https://developers.line.biz/en/reference/messaging-api/),
so that you do not need to worry about HTTP requests and can focus on data.
For type signatures of the methods, please refer to [its API reference](../apidocs/globals.md).

## Create a client

The `LineBotClient` class is provided by the main module. It bundles the
channel-access-token based bot APIs (Messaging, Insight, LIFF, etc.) into a
single object so that you do not need to manage individual clients per API group.

```js
// ES modules or TypeScript
import { LineBotClient } from '@line/bot-sdk';

// CommonJS
const { LineBotClient } = require('@line/bot-sdk');
```

To create a client instance:

```js
const client = LineBotClient.fromChannelAccessToken({
    channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN',
});
```

And now you can call client functions as usual:

```js
await client.pushMessage({
  to: userId,
  messages: [{ type: 'text', text: 'hello, world' }]
});
```

For issuing, verifying, or revoking channel access tokens, use
`channelAccessToken.ChannelAccessTokenClient` directly:

```js
import { channelAccessToken } from '@line/bot-sdk';

const tokenClient = new channelAccessToken.ChannelAccessTokenClient({});
```

## Retrieving parameters from webhook

Many of data used in the client functions, such as user IDs or reply tokens, can
be obtained from nowhere but webhook.

Webhook event objects are just plain JSON objects, sent as request body, so you
can easily access and use it.

```js
const event = req.body.events[0];

if (event.type === 'message') {
  const message = event.message;

  if (message.type === 'text' && message.text === 'bye') {
    if (event.source.type === 'room') {
      await client.leaveRoom(event.source.roomId);
    } else if (event.source.type === 'group') {
      await client.leaveGroup(event.source.groupId);
    } else {
      await client.replyMessage({
        replyToken: event.replyToken,
        messages: [{
          type: 'text',
          text: 'I cannot leave a 1-on-1 chat!',
        }]
      });
    }
  }
}
```

For more detail of building webhook and retrieve event objects, please refer to
its [guide](./webhook.md).

## How to get response header and HTTP status code

You may need to store the `x-line-request-id` header obtained as a response from several APIs.
In this case, please use `~WithHttpInfo` functions. You can get headers and status codes.
The `x-line-accepted-request-id` or `content-type` header can also be obtained in the same way.

```js
await client
  .replyMessageWithHttpInfo({
    replyToken: replyToken,
    messages: [message]
  })
  .then((response) => {
    console.log(response.httpResponse.headers.get('x-line-request-id'));
    console.log(response.httpResponse.status);
  });
```

## Error handling

There are several error types that may be thrown during client usage.

- `HTTPFetchError`: The server returned a non-2xx HTTP status code. Exposes `status`, `statusText`, `headers`, and `body`.
- `TypeError` (native): A network-level failure (DNS, connection refused, etc.) from the underlying `fetch()` call. Not wrapped by the SDK.
- `SyntaxError` (native): JSON parsing fails for a response body. Not wrapped by the SDK.

For methods returning `Promise`, you can handle the errors
with [`catch()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)
method. For others returning `ReadableStream`, you can observe the `'error'`
event for the stream.

```js
await client
  .replyMessage({
    replyToken: replyToken,
    messages: [message]
   })
  .catch((err) => {
    if (err instanceof HTTPFetchError) {
      console.error(err.status);
      console.error(err.headers.get('x-line-request-id'));
      console.error(err.body);
    }
  });

const stream = await client.getMessageContent(messageId);
stream.on('error', (err) => {
  console.log(err.message);
});
```

You can check which method returns `Promise` or `Readable` in the API
reference of [`LineBotClient`](../apidocs/globals.md). For type signatures of the
errors above, please refer to below.

- [HTTPFetchError](https://line.github.io/line-bot-sdk-nodejs/apidocs/classes/HTTPFetchError.html)
- [SignatureValidationFailed](https://line.github.io/line-bot-sdk-nodejs/apidocs/classes/SignatureValidationFailed.html)
