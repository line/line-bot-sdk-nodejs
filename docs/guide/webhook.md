# Webhook

A webhook server for LINE messaging API is just a plain HTTP(S) server. When
there is a observable user event, an HTTP request will be sent to a
pre-configured webhook server.

About configuration of webhook itself, please refer to [Webhook](https://developers.line.biz/en/reference/messaging-api/#webhooks)
of the official document.

## What a webhook server should do

- [Signature validation](https://developers.line.biz/en/reference/messaging-api/#signature-validation)
- [Webhook event object parsing](https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects)

**Signature validation** is checking if a request is actually sent from real
LINE servers, not a fraud. The validation is conducted by checking
the [X-Line-Signature](https://developers.line.biz/en/reference/messaging-api/#signature-validation) header
and request body. There is a [`validateSignature()`](../apidocs/globals.html#validatesignature)
function to do this.

**Webhook event object parsing** is literally parsing webhook event objects,
which contains information of each webhook event. The objects are provided as
request body in JSON format, so any body parser will work here.

There is a function to generate a [connect](https://github.com/senchalabs/connect) middleware,
[`middleware()`](https://github.com/line/line-bot-sdk-nodejs/blob/master/lib/middleware.ts), to conduct both of them. If
your server can make use of connect middlewares, such as [Express](https://expressjs.com/),
using the middleware is a recommended way to build a webhook server.

## Build a webhook server with Express

[Express](https://expressjs.com/) is a minimal web framework for Node.js, which
is widely used in Node.js communities. You can surely build a webhook server
with any web framework, but we use Express as an example here for its
popularity.

We skip the detailed guide for Express.  If more information is needed about
Express, please refer to its documentation.

Here is an example of an HTTP server built with Express.
The server above listens to 8080 and will response with an empty object for
`POST /webhook`. We will add webhook functionality to this server.

``` js
import express from 'express'
import { middleware } from '@line/bot-sdk'

const app = express()

const config = {
  channelSecret: 'YOUR_CHANNEL_SECRET'
}

app.post('/webhook', middleware(config), (req, res) => {
  req.body.events // webhook event objects from LINE Platform
  req.body.destination // user ID of the bot
  ...
})

app.listen(8080)
```

We have imported `middleware` from `@line/bot-sdk` and make the Express app to use
the middleware. The middleware validates the request and parses webhook event
object. It embeds body-parser and parses them to objects. If you have a reason
to use another body-parser separately for other routes, please keep in mind the
followings.

### Do not use the webhook `middleware()` for other usual routes

``` js
// don't
app.use(middleware(config))

// do
app.use('/webhook', middleware(config))
```

The middleware will throw an exception when the [X-Line-Signature](https://developers.line.biz/en/reference/messaging-api/#signature-validation)
header is not set. If you want to handle usual user requests, the middleware
shouldn't be used for them.

### Do not use another body-parser before the webhook `middleware()`

``` js
// don't
app.use(bodyParser.json())
app.use('/webhook', middleware(config))

// do
app.use('/webhook', middleware(config))
app.use(bodyParser.json())
```

If another body parser already parsed a request's body, the webhook middleware
cannot access to the raw body of the request. The raw body should be retrieved
for signature validation.

However, there are environments where `req.body` is pre-parsed, such as
[Firebase Cloud Functions](https://firebase.google.com/docs/functions/http-events).
If it parses the body into string or buffer, the middleware will use the body
as it is and work just fine. If the pre-parsed body is an object, the webhook
middleware will fail to work. In the case, please use [`validateSignature()`](../apidocs/globals.html#validatesignature)
manually with raw body.

## Error handling

There are two types of errors thrown by the middleware, one is `SignatureValidationFailed`
and the other is `JSONParseError`.

- `SignatureValidationFailed` is thrown when a request doesn't have a signature.
- `SignatureValidationFailed` is thrown when a request has a wrong signature.
- `JSONParseError` occurs when a request body cannot be parsed as JSON.

For type references of the errors, please refer to [the API reference](../apidocs/globals.md).

The errors can be handled with [error middleware](https://github.com/senchalabs/connect#error-middleware).

``` js
import express from 'express'
import {middleware, JSONParseError, SignatureValidationFailed} from '@line/bot-sdk'

const app = express()

const config = {
  channelSecret: 'YOUR_CHANNEL_SECRET'
}

app.use(middleware(config))

app.post('/webhook', (req, res) => {
  res.json(req.body.events) // req.body will be webhook event object
})

app.use((err, req, res, next) => {
  if (err instanceof SignatureValidationFailed) {
    res.status(401).send(err.signature)
    return
  } else if (err instanceof JSONParseError) {
    res.status(400).send(err.raw)
    return
  }
  next(err) // will throw default 500
})

app.listen(8080)
```

You can read other examples in [lien-bot-sdk-nodejs/examples](https://github.com/line/line-bot-sdk-nodejs/tree/master/examples)

## HTTPS

The webhook URL should have HTTPS protocol. There are several ways to build an
HTTPS server. For example, here is a [documentation](https://expressjs.com/en/api.html#app.listen)
of making Express work with HTTPS. You can also set HTTPS in web servers like
[NGINX](https://www.nginx.com/). This guide will not cover HTTPS configuration,
but do not forget to set HTTPS beforehand.

For development and test usages, [ngrok](https://ngrok.com/) works perfectly.
