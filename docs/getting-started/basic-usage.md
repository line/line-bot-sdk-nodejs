# Basic Usage

It can be imported with [CommonJS](https://nodejs.org/docs/latest/api/modules.html),
[ES2015 modules](https://babeljs.io/learn-es2015/#ecmascript-2015-features-modules),
and preferably [TypeScript](https://www.typescriptlang.org/).

The library is written in TypeScript and includes TypeScript definitions by
default. Nevertheless, it can surely be used with plain JavaScript too.

``` js
// CommonJS
const line = require('@line/bot-sdk');

// ES2015 modules or TypeScript
import * as line from '@line/bot-sdk';
```

## Configuration

For the usage of webhook and client, LINE channel access token and secret are
needed. About issuing the token and secret, please refer to [Getting started with the Messaging API](https://developers.line.me/messaging-api/getting-started).

``` js
const config = {
  channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN',
  channelSecret: 'YOUR_CHANNEL_SECRET'
};

new line.Client(config);
line.middleware(config);
```

## Synopsis

Here is a synopsis of echoing webhook server with [Express](https://expressjs.com/):

``` js
const express = require('express');
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN',
  channelSecret: 'YOUR_CHANNEL_SECRET'
};

const app = express();
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

const client = new line.Client(config);
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text
  });
}

app.listen(3000);
```

The full examples with comments can be found in [examples](https://github.com/line/line-bot-sdk-nodejs/tree/master/examples/).

For the specifications of API, please refer to [API Reference](../api-reference.md).
