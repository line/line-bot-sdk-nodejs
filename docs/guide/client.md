# Client

Client is to send messages, get user or content information, or leave chats.
A client instance provides functions for [messaging APIs](https://developers.line.me/en/docs/messaging-api/reference/),
so that you do not need to worry about HTTP requests and can focus on data.
For type signatures of the methods, please refer to [its API reference](../api-reference/client.md).

## Create a client

The `Client` class is provided by the main module.

``` js
// CommonJS
const Client = require('@line/bot-sdk').Client;

// ES6 modules or TypeScript
import { Client } from '@line/bot-sdk';
```

To create a client instance:

```js
const client = new Client({
  channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN',
  channelSecret: 'YOUR_CHANNEL_SECRET'
});
```

And now you can call client functions as usual:

``` js
client.pushMessage(userId, { type: 'text', text: 'hello, world' });
```

## Retrieving parameters from webhook

Many of data used in the client functions, such as user IDs or reply tokens, can
be obtained from nowhere but webhook.

Webhook event objects are just plain JSON objects, sent as request body, so you
can easily access and use it.

``` js
const event = req.body.events[0];

if (event.type === 'message') {
  const message = event.message;

  if (message.type === 'text' && message.text === 'bye') {
    if (event.source.type === 'room') {
      client.leaveRoom(event.source.roomId);
    } else if (event.source.type === 'group') {
      client.leaveGroup(event.source.groupId);
    } else {
      client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'I cannot leave a 1-on-1 chat!',
      });
    }
  }
}
```

For more detail of building webhook and retrieve event objects, please refer to
its [guide](./webhook.html).

## Error handling

There are 4 types of errors caused by client usage.

- `RequestError`: A request fails by, for example, wrong domain or server
  refusal.
- `ReadError`: Reading from a response pipe fails.
- `HTTPError`: Server returns a non-2xx response.
- `JSONParseError`: JSON parsing fails for response body.

For methods returning `Promise`, you can handle the errors with [`catch()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)
method. For others returning `ReadableStream`, you can observe the `'error'`
event for the stream.

``` js
client
  .replyMessage(replyToken, message)
  .catch((err) => {
    if (err instanceof HTTPError) {
      console.error(err.statusCode);
    }
  });

const stream = client.getMessageContent(messageId);
stream.on('error', (err) => {
  console.log(err.message);
});
```

You can check which method returns `Promise` or `ReadableStream` in the API
reference of [`Client`](../api-reference/client.md). For type signatures of the
errors above, please refer to [Exceptions](../api-reference/exceptions.md).
