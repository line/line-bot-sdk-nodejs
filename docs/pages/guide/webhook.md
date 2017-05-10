# Webhook

A webhook server for LINE messaging API is just a plain HTTP(S) server. When
there is a observable user event, an HTTP request will be sent to a
pre-configured webhook server.

About configuration of webhook itself, please refer to [Webhook](https://devdocs.line.me/en/#webhooks)
of the official document.

## What a webhook server should do

- [Signature validation](https://devdocs.line.me/en/#signature-validation)
- [Webhook event object parsing](https://devdocs.line.me/en/#webhook-event-object)

**Signature validation** is checking if a request is actually sent from real
LINE servers, not a fraud. The validation is conducted by checking
the [X-Line-Signature](https://devdocs.line.me/en/#signature-validation) header
and request body. There is a [`validateSignature()`](../api-reference/validate-signature.md)
function to do this.

**Webhook event object parsing** is literally parsing webhook event objects,
which contains information of each webhook event. The objects are provided as
request body in JSON format, so any body parser will work here.

There is a function to generate a [connect](https://github.com/senchalabs/connect) middleware,
[`middleware()`](../api-reference/middleware.md), to conduct both of them. If
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

``` js
const express = require('express')

const app = express()

app.post('/webhook', (req, res) => {
  res.json({})
})

app.listen(8080)
```

The server above listens to 8080 and will response with an empty object for
`POST /webhook`. We will add webhook functionality to this server.

``` js
const express = require('express')
const middleware = require('NPM_PACKAGE_NAME').middleware

const app = express()

const config = {
  channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN',
  channelSecret: 'YOUR_CHANNEL_SECRET'
}

app.use(middleware(config))

app.post('/webhook', (req, res) => {
  res.json(req.body.events) // req.body will be webhook event object
})

app.listen(8080)
```

We have imported `middleware` from the package and make the Express app to use
the middleware. The middlware validates the request and parses webhook event
object. It internally uses [body-parser](https://github.com/expressjs/body-parser),
so please beware that it will not work with body parsed already by body-parser.
Please put `middleware()` upper than any body-parser middleware.

``` js
// don't
app.use(bodyParser.json())
app.use(middleware(config))

// do
app.use(middleware(config))
app.use(bodyParser.json())
```

`middleware()` will work only on requests with `X-Line-Signature`, so other body
parsers will work well with requests without the signature header.

## Error handling

There are two types of errors thrown by the middleware, one is `SignatureValidationFailed`
and the other is `JSONParseError`. `SignatureValidationFailed` is thrown when a
request has a wrong signature, which usually means the request is not from the
official LINE servers. `JSONParseError` occurs when a request body cannot be
parsed as JSON.

For type references of the errors, please refer to [the API reference](../api-reference/exceptions.md).

The errors can be handled with [error middleware](https://github.com/senchalabs/connect#error-middleware).

``` js
const express = require('express')
const middleware = require('NPM_PACKAGE_NAME').middleware
const JSONParseError = require('NPM_PACKAGE_NAME/exceptions').JSONParseError
const SignatureValidationFailed = require('NPM_PACKAGE_NAME/exceptions').SignatureValidationFailed

const app = express()

const config = {
  channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN',
  channelSecret: 'YOUR_CHANNEL_SECRET'
}

app.use(middleware(config))

app.post('/webhook', (req, res) => {
  res.json(req.body.events) // req.body will be webhook event object
})

app.use((err, req, res, next) => {
  if (err instanceof SignatureValidationFailed) {
    res.status(401).send(err.signature);
    return;
  } else if (err instanceof JSONParseError) {
    res.status(400).send(err.raw);
    return;
  }
  next(err); // will throw default 500
})

app.listen(8080)
```

## HTTPS

The webhook URL should have HTTPS protocol. There are several ways to build an
HTTPS server. For example, here is a [documentation](https://expressjs.com/en/api.html#app.listen)
of making Express work with HTTPS. You can also set HTTPS in web servers like
[NGINX](https://www.nginx.com/). This guide will not cover HTTPS configuration,
but do not forget to set HTTPS beforehand.
