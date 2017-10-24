# `middleware(config)`

It returns a [connect](https://github.com/senchalabs/connect) middleware used
by several Node.js web frameworks such as [Express](https://expressjs.com/).

#### Type signature

``` typescript
function middleware(config: MiddlewareConfig): Middleware
```

The types of `MiddlewareConfig` and `Middleware` are like below.

``` typescript
interface MiddlewareConfig {
  channelAccessToken?: string;
  channelSecret: string;
}

type Middleware =
  ( req: http.IncomingMessage
  , res: http.ServerResponse
  , next: (err?: Error) => void
  ) => void
```

The `Middleware` type is defined according to the connect middleware itself. For
the detail of the connect middleware, please refer to the [connect](https://github.com/senchalabs/connect) documentation.

## Usage

A very simple example of the middleware usage with an Express app is like below:

``` js
// globally
app.use(middleware(config))

// or directly with handler
app.post('/webhook', middleware(config), (req, res) => {
  req.body.events // will include webhook events
  ...
})
```

The middleware returned by `middleware()` parses body and checks signature
validation, so you do not need to use [`validateSignature()`](./validate-signature.md)
directly.

You do not need to use [body-parser](https://github.com/expressjs/body-parser)
to parse webhook events, as `middleware()` embeds body-parser and parses them to
objects. Please keep in mind that it will not process requests without
`X-Line-Signature` header. If you have a reason to use body-parser for other
routes, *please do not use it before the LINE middleware*. body-parser parses
the request body up and the LINE middleware cannot parse it afterwards.

``` js
// don't
app.use(bodyParser.json())
app.use(middleware(config))

// do
app.use(middleware(config))
app.use(bodyParser.json())
```

There are environments where `req.body` is pre-parsed, such as [Firebase Cloud Functions](https://firebase.google.com/docs/functions/http-events).
If it parses the body into string or buffer, do not worry as the middleware will
work just fine. If the pre-parsed body is an object, please use [`validateSignature()`](../api-reference/validate-signature.md)
manually with the raw body.

About building webhook server, please refer to [Webhook](../guide/webhook.md).
