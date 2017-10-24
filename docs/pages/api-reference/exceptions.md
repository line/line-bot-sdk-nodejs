# Exceptions

Exception classes can also be imported from `@line/bot-sdk`.

``` js
// CommonJS (destructuring can be used for Node.js >= 6)
const HTTPError = require('@line/bot-sdk').HTTPError;
const JSONParseError = require('@line/bot-sdk').JSONParseError;
const ReadError = require('@line/bot-sdk').ReadError;
const RequestError = require('@line/bot-sdk').RequestError;
const SignatureValidationFailed = require('@line/bot-sdk').SignatureValidationFailed;

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
