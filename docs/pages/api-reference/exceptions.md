# Exceptions

Exception classes can be imported via `@line/bot-sdk/exceptions'`.

``` js
// CommonJS
const HTTPError = require('@line/bot-sdk/exceptions').HTTPError;
const JSONParseError = require('@line/bot-sdk/exceptions').JSONParseError;
const ReadError = require('@line/bot-sdk/exceptions').ReadError;
const RequestError = require('@line/bot-sdk/exceptions').RequestError;
const SignatureValidationFailed = require('@line/bot-sdk/exceptions').SignatureValidationFailed;

// ES2015 modules or TypeScript
import {
  HTTPError,
  JSONParseError,
  ReadError,
  RequestError,
  SignatureValidationFailed,
} from '@line/bot-sdk/exceptions';
```

#### Type signature

``` typescript
class SignatureValidationFailed extends Error {
  public signature?: string;
}

class JSONParseError extends Error {
  public raw: any;
}

class RequestError extends Error {
  public code: string; // e.g. ECONNREFUSED
}

class ReadError extends Error {
}

class HTTPError extends Error {
  public statusCode: number; // e.g. 404
  public statusMessage: string; // e.g. Not Found
}
```

About what causes the errors and how to handle them, please refer to each guide
of [webhook](../guide/webhook.md) and [client](../guide/client.md).
