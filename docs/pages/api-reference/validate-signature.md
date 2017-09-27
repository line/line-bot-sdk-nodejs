# `validateSignature(body, channelSecret, signature)`

It is a function to check if a provided channel secret is valid, compared with a
provided body.

#### Type signature

``` typescript
function validateSignature(
  body: string | Buffer,
  channelSecret: string,
  signature: string,
): boolean
```

`body` can be a string or buffer. When it's a string, it will be handled as if
it's encoded in UTF-8.

For more details about signature validation of LINE webhook, please refer
to [the official documentation](https://developers.line.me/en/docs/messaging-api/reference/#webhooks).
