# Exceptions

Exception classes can be imported via `NPM_PACKAGE_NAME/exceptions'`.

``` js
// CommonJS
const HTTPError = require('NPM_PACKAGE_NAME/exceptions').HTTPError;
const JSONParseError = require('NPM_PACKAGE_NAME/exceptions').JSONParseError;
const ReadError = require('NPM_PACKAGE_NAME/exceptions').ReadError;
const RequestError = require('NPM_PACKAGE_NAME/exceptions').RequestError;
const SignatureValidationFailed = require('NPM_PACKAGE_NAME/exceptions').SignatureValidationFailed;

// ES2015 modules or TypeScript
import {
  HTTPError,
  JSONParseError,
  ReadError,
  RequestError,
  SignatureValidationFailed,
} from 'NPM_PACKAGE_NAME/exceptions';
```

#### Type signature

``` typescript
class SignatureValidationFailed extends Error {
  public signature: string;
}

class JSONParseError extends Error {
  public raw: string;
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
