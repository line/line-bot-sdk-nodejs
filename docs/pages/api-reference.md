# API Reference

When imported via `require` or `import`, 3 interfaces are exposed.

``` js
// CommonJS
const line = require('@line/bot-sdk');

// ES2015 modules or TypeScript
import * as line from '@line/bot-sdk';
```

For the detailed API reference of each, please refer to their own pages.

- [Client](api-reference/client.md)
- [validateSignature](api-reference/validate-signature.md)
- [middleware](api-reference/middleware.md)

Exceptions can be imported via `@line/bot-sdk/exceptions`.

``` js
// CommonJS
const JSONParseError = require('@line/bot-sdk/exceptions').JSONParseError;

// ES2015 modules or TypeScript
import { JSONParseError } from '@line/bot-sdk/exceptions';
```

- [Exceptions](api-reference/exceptions.md)
