# Client

Client is to send messages, get user or content information, or leave chats.
A client instance provides functions for [messaging APIs](https://developers.line.biz/en/reference/messaging-api/),
so that you do not need to worry about HTTP requests and can focus on data.
For type signatures of the methods, please refer to [its API reference](../apidocs/globals.md).

## Create a client

The `MessagingApiClient` class is provided by the main module.

``` js
// ES modules or TypeScript
import { messagingApi } from '@line/bot-sdk';
const { MessagingApiClient } = messagingApi;
// OR
import * as line from '@line/bot-sdk';
const MessagingApiClient = line.messagingApi.MessagingApiClient;

// CommonJS
const MessagingApiClient = require('@line/bot-sdk').messagingApi.MessagingApiClient;
```

To create a client instance:

```js
const client = new MessagingApiClient({
    channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN',
});
```

And now you can call client functions as usual:

``` js
client.pushMessage({
  to: userId,
  messages: [{ type: 'text', text: 'hello, world' }]
});
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
      client.replyMessage({
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
You may need to store the ```x-line-request-id``` header obtained as a response from several APIs.
In this case, please use ```~WithHttpInfo``` functions. You can get headers and status codes.
The ```x-line-accepted-request-id``` or ```content-type``` header can also be obtained in the same way.

``` js
client
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

There are 4 types of errors caused by client usage.

- `RequestError`: A request fails by, for example, wrong domain or server
  refusal.
- `ReadError`: Reading from a response pipe fails.
- `HTTPFetchError`: Server returns a response with non-2xx HTTP status code.
  - (`HTTPError`: You get this error when you use deprecated client. This is not used in the maintained clients.)
- `JSONParseError`: JSON parsing fails for response body.

For methods returning `Promise`, you can handle the errors
with [`catch()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)
method. For others returning `ReadableStream`, you can observe the `'error'`
event for the stream.

``` js
client
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

const stream = client.getMessageContent(messageId);
stream.on('error', (err) => {
  console.log(err.message);
});
```

You can check which method returns `Promise` or `ReadableStream` in the API
reference of [`Client`](../apidocs/globals.md). For type signatures of the
errors above, please refer to [Exceptions](../apidocs/globals.md).
