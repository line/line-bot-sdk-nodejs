# `middleware(config)`

It returns a [connect](https://github.com/senchalabs/connect) middleware used
by several Node.js web frameworks such as [Express](https://expressjs.com/).

#### Type signature

``` typescript
function middleware(config: Config): Middleware
```

The types of `Config` and `Middleware` are like below.

``` typescript
type Config = {
  channelAccessToken?: string,
  channelSecret: string,
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
directly. Also, you do not need to use [body-parser](https://github.com/expressjs/body-parser)
to parse webhook events. If you have a reason to use body-parser for other
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


About building webhook server, please refer to [Webhook](../guide/webhook.md).
