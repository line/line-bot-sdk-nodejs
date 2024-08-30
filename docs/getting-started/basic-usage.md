# Basic Usage

It can be imported with [CommonJS](https://nodejs.org/docs/latest/api/modules.html),
[ECMAScript modules(ES modules)](https://tc39.es/ecma262/#sec-modules),
and preferably [TypeScript](https://www.typescriptlang.org/).

The library is written in TypeScript and includes TypeScript definitions by
default. Nevertheless, it can surely be used with plain JavaScript too.

``` js
// ES Modules or TypeScript
import * as line from '@line/bot-sdk';

// CommonJS
const line = require('@line/bot-sdk');
```

## Configuration

For the usage of webhook and client, LINE channel access token and secret are
needed. About issuing the token and secret, please refer
to [Getting started with the Messaging API](https://developers.line.biz/en/docs/messaging-api/getting-started/).

``` js
new line.messagingApi.MessagingApiClient({
  channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN',
});
line.middleware({
  channelSecret: 'YOUR_CHANNEL_SECRET'
});
```

## Synopsis

Here is a synopsis of echoing webhook server with [Express](https://expressjs.com/):

``` js
import * as line from '@line/bot-sdk'
import express from 'express'

// create LINE SDK config from env variables
const config = {
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create an echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [echo],
  });
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
```

The full examples with comments can be found
in [examples](https://github.com/line/line-bot-sdk-nodejs/tree/master/examples/).

For the specifications of API, please refer to [API Reference](../apidocs/globals.md).
