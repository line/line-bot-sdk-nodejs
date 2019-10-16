# `new OAuth()`

`OAuth` is a class representing OAuth APIs. It provides methods
corresponding to [messaging APIs](https://developers.line.biz/en/reference/messaging-api/#issue-channel-access-token).

#### Type signature

``` typescript
class OAuth {
  constructor() {}

  issueAccessToken(client_id: string, client_secret: string): Promise<{
    access_token: string;
    expires_in: number;
    token_type: "Bearer";
  }>
  revokeAccessToken(access_token: string): Promise<{}>
}
```

## Create a OAuth

The `OAuth` class is provided by the main module.

``` js
// CommonJS
const { OAuth } = require('@line/bot-sdk');

// ES6 modules or TypeScript
import { OAuth } from '@line/bot-sdk';
```

To create a client instance:

```js
const oauth = new OAuth();
```

And now you can call client functions as usual:

``` js
const { access_token } = await oauth.issueAccessToken("client_id", "client_secret");
```

## Methods

For functions returning `Promise`, there will be errors thrown if something
goes wrong, such as HTTP errors or parsing errors. You can catch them with the
`.catch()` method of the promises. The detailed error handling is explained
in [the Client guide](../guide/client.md).

### OAuth

#### `issueAccessToken(client_id: string, client_secret: string): Promise<{ access_token: string; expires_in: number; token_type: "Bearer"; }>`

It corresponds to the [Issue channel access token](https://developers.line.biz/en/reference/messaging-api/#issue-channel-access-token) API.

``` js
const { access_token, expires_in, token_type } = await oauth.issueAccessToken("client_id", "client_secret");
```


#### `revokeAccessToken(access_token: string): Promise<{}>`

It corresponds to the [Revoke channel access token](https://developers.line.biz/en/reference/messaging-api/#revoke-channel-access-token) API.


``` js
await oauth.revokeAccessToken("access_token");
```