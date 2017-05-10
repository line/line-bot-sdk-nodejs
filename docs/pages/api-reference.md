# API Reference

When imported via `require` or `import`, 3 interfaces are exposed.

``` js
// CommonJS
const line = require('NPM_PACKAGE_NAME');

// ES2015 modules or TypeScript
import * as line from 'NPM_PACKAGE_NAME';
```

For the detailed API reference of each, please refer to their own pages.

- [Client](api-reference/client.md)
- [validateSignature](api-reference/validate-signature.md)
- [middleware](api-reference/middleware.md)

Exceptions can be imported via `NPM_PACKAGE_NAME/exceptions`.

``` js
// CommonJS
const JSONParseError = require('NPM_PACKAGE_NAME/exceptions').JSONParseError;

// ES2015 modules or TypeScript
import { JSONParseError } from 'NPM_PACKAGE_NAME/exceptions';
```

- [Exceptions](api-reference/exceptions.md)
